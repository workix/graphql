import { VisibilitySetting, ProfileView, ContactUnlock, Subscription, Plan } from '../../../models';
import { Op } from 'sequelize';

export interface VisibilitySettingsData {
  searchable_by_recruiters?: boolean;
  open_to_work_visible?: boolean;
  show_as_viewed?: boolean;
}

export interface RevealResult {
  allow: boolean;
  reason?: string;
}

export class VisibilityService {
  /**
   * Obtém as configurações de visibilidade do candidato (cria padrão se inexistente)
   */
  async getSettings(candidateId: number) {
    let settings = await VisibilitySetting.findOne({ where: { candidate_id: candidateId } });
    if (!settings) {
      settings = await VisibilitySetting.create({
        candidate_id: candidateId,
        searchable_by_recruiters: true,
        open_to_work_visible: false,
        show_as_viewed: true
      });
    }
    return settings;
  }

  /**
   * Atualiza as 3 chaves de visibilidade do candidato
   */
  async updateSettings(candidateId: number, data: VisibilitySettingsData) {
    let settings = await VisibilitySetting.findOne({ where: { candidate_id: candidateId } });
    if (!settings) {
      settings = await VisibilitySetting.create({
        candidate_id: candidateId,
        searchable_by_recruiters: data.searchable_by_recruiters ?? true,
        open_to_work_visible: data.open_to_work_visible ?? false,
        show_as_viewed: data.show_as_viewed ?? true
      });
    } else {
      await settings.update({
        searchable_by_recruiters: data.searchable_by_recruiters ?? settings.searchable_by_recruiters,
        open_to_work_visible: data.open_to_work_visible ?? settings.open_to_work_visible,
        show_as_viewed: data.show_as_viewed ?? settings.show_as_viewed,
        updated_at: new Date()
      });
    }
    return settings;
  }

  /**
   * Função centralizada server-side para autorização de exibição de dados pessoais (reveal)
   */
  async reveal(
    candidateId: number,
    viewerOrganizationId: number | null,
    dataScope: 'summary' | 'contact' | 'full_profile' = 'summary',
    isCandidateSelf: boolean = false
  ): Promise<RevealResult> {
    if (isCandidateSelf) {
      return { allow: true };
    }

    const settings = await this.getSettings(candidateId);

    // 1. Chave geral de busca
    if (!settings.searchable_by_recruiters) {
      return {
        allow: false,
        reason: 'O candidato configurou seu perfil como não visível para buscas ativas de recrutadores.'
      };
    }

    // 2. Dados de contato e currículo desanonimizado
    if (dataScope === 'contact' || dataScope === 'full_profile') {
      if (!viewerOrganizationId) {
        return {
          allow: false,
          reason: 'Identificação da organização contratante é obrigatória para acessar dados de contato.'
        };
      }

      const unlock = await ContactUnlock.findOne({
        where: {
          organization_id: viewerOrganizationId,
          candidate_id: candidateId
        }
      });

      if (!unlock) {
        return {
          allow: false,
          reason: 'Acesso a contato requer desbloqueio explícito com notificação ao candidato.'
        };
      }
    }

    return { allow: true };
  }

  /**
   * Registra visualização de perfil com consentimento
   */
  async recordProfileView(
    viewerOrganizationId: number,
    viewerUserId: number,
    candidateId: number,
    source: string = 'search'
  ) {
    const settings = await this.getSettings(candidateId);
    if (!settings.show_as_viewed) {
      return null;
    }

    return await ProfileView.create({
      viewer_organization_id: viewerOrganizationId,
      viewer_user_id: viewerUserId,
      candidate_id: candidateId,
      source: source,
      viewed_at: new Date()
    });
  }

  /**
   * Purga automática de registros de visualização de perfil (12 meses Premium / 7 dias Free)
   */
  async purgeOldProfileViews() {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);

    // Remove registros com mais de 365 dias para qualquer usuário
    const purgedGeneral = await ProfileView.destroy({
      where: {
        viewed_at: {
          [Op.lt]: oneYearAgo
        }
      }
    });

    // Remove registros com mais de 7 dias para visualizações gerais
    const purgedFree = await ProfileView.destroy({
      where: {
        viewed_at: {
          [Op.lt]: sevenDaysAgo
        }
      }
    });

    return { purgedGeneral, purgedFree };
  }
}

export const visibilityService = new VisibilityService();
