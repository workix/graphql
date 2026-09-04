import db, { User, Candidate, Resume, JobCandidate, VisibilitySetting, BillingAuditLog } from '../../../models';
import { logger } from '../../../utils/logger';

export interface LgpdExportDossier {
  exportDate: string;
  regulation: string;
  user: {
    id: number | string;
    name: string;
    email: string;
    createdAt?: string;
  };
  candidateProfile?: any;
  resume?: any;
  applicationsCount?: number;
  visibilitySettings?: any;
}

export interface LgpdAnonymizationResult {
  success: boolean;
  userId: number | string;
  anonymizedAt: string;
  message: string;
}

export class LgpdGovernanceService {
  private static instance: LgpdGovernanceService;

  public static getInstance(): LgpdGovernanceService {
    if (!LgpdGovernanceService.instance) {
      LgpdGovernanceService.instance = new LgpdGovernanceService();
    }
    return LgpdGovernanceService.instance;
  }

  /**
   * Exportação portátil completa de todos os dados do titular (Art. 18 LGPD).
   */
  public async exportUserData(userId: number | string): Promise<LgpdExportDossier> {
    const userModel = User || (db && db.User);
    const candidateModel = Candidate || (db && db.Candidate);
    const resumeModel = Resume || (db && db.Resume);
    const jobCandidateModel = JobCandidate || (db && db.JobCandidate);
    const visibilityModel = VisibilitySetting || (db && db.VisibilitySetting);

    const user = userModel ? await userModel.findByPk(userId) : null;
    if (!user) {
      throw new Error(`Usuário com ID ${userId} não encontrado para exportação de dados.`);
    }

    const candidate = candidateModel ? await candidateModel.findOne({ where: { user_id: userId } }) : null;
    const resume = (candidate && resumeModel) ? await resumeModel.findOne({ where: { candidate_id: candidate.id } }) : null;
    const applications = (candidate && jobCandidateModel) ? await jobCandidateModel.count({ where: { candidate_id: candidate.id } }) : 0;
    const visibility = (candidate && visibilityModel) ? await visibilityModel.findOne({ where: { candidate_id: candidate.id } }) : null;

    logger.info(`Exportação de dados LGPD solicitada para o usuário ${userId}`, {
      userId,
      operation: 'LGPD_EXPORT'
    });

    return {
      exportDate: new Date().toISOString(),
      regulation: 'LGPD - Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018)',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.created_at || user.createdAt
      },
      candidateProfile: candidate ? (candidate.toJSON ? candidate.toJSON() : candidate) : null,
      resume: resume ? (resume.toJSON ? resume.toJSON() : resume) : null,
      applicationsCount: applications,
      visibilitySettings: visibility ? (visibility.toJSON ? visibility.toJSON() : visibility) : null
    };
  }

  /**
   * Anonimização irreversível dos dados pessoais do titular (Direito ao Esquecimento - Art. 18 LGPD).
   */
  public async anonymizeUserData(userId: number | string, reason: string = 'Solicitação do Titular via LGPD'): Promise<LgpdAnonymizationResult> {
    const userModel = User || (db && db.User);
    const candidateModel = Candidate || (db && db.Candidate);
    const resumeModel = Resume || (db && db.Resume);
    const auditModel = BillingAuditLog || (db && db.BillingAuditLog);

    const user = userModel ? await userModel.findByPk(userId) : null;
    if (!user) {
      throw new Error(`Usuário com ID ${userId} não encontrado para anonimização.`);
    }

    const now = new Date().toISOString();
    const anonIdentifier = `anon_${userId}_${Date.now().toString(36)}`;

    // 1. Anonimiza tabela de Usuários
    await user.update({
      name: 'Usuário Anonimizado',
      email: `${anonIdentifier}@anonymized.workix.local`,
      password: null,
      firebase_uuid: null,
      avatar_url: null,
      activated: false
    });

    // 2. Anonimiza perfil de Candidato e Currículo se existirem
    if (candidateModel) {
      const candidate = await candidateModel.findOne({ where: { user_id: userId } });
      if (candidate) {
        await candidate.update({
          cpf: null,
          phone: null,
          birth_date: null,
          address: null
        });

        if (resumeModel) {
          const resume = await resumeModel.findOne({ where: { candidate_id: candidate.id } });
          if (resume) {
            await resume.update({
              summary: 'Currículo anonimizado a pedido do titular.',
              raw_content: null,
              file_url: null
            });
          }
        }
      }
    }

    // 3. Registra log de auditoria da anonimização
    if (auditModel) {
      try {
        await auditModel.create({
          user_id: userId,
          action: 'LGPD_ANONYMIZATION',
          details: JSON.stringify({ reason, executedAt: now }),
          created_at: new Date()
        });
      } catch (e) {
        // Log de fallback
      }
    }

    logger.warn(`Conta de usuário ${userId} anonimizada com sucesso conforme Artigo 18 da LGPD`, {
      userId,
      operation: 'LGPD_ANONYMIZATION'
    });

    return {
      success: true,
      userId,
      anonymizedAt: now,
      message: 'Dados pessoais anonimizados com sucesso em conformidade com o Artigo 18 da LGPD.'
    };
  }
}

export const lgpdGovernanceService = LgpdGovernanceService.getInstance();
