import { Candidate, ContactUnlock, User } from '../../../models';
import { entitlementsService } from '../../premium/services/entitlements.service';
import { visibilityService } from './visibility.service';

export class ContactUnlockService {
  /**
   * Desbloqueia dados de contato de um candidato com débito de crédito e notificação obrigatória
   */
  async unlockContact(organizationId: number, userId: number, candidateId: number, mqserver?: any) {
    const candidate = await Candidate.findByPk(candidateId, {
      include: [{ model: User, as: 'user' }]
    });

    if (!candidate) {
      throw new Error(`Candidato com id ${candidateId} não encontrado.`);
    }

    // 1. Verifica permissão de capacidade (créditos de contato)
    const canUnlock = await entitlementsService.can(organizationId, 'contact_credits', 1);
    if (!canUnlock.allow) {
      throw new Error(canUnlock.reason || 'Saldo insuficiente de créditos para desbloquear contato.');
    }

    // 2. Verifica configurações de privacidade do candidato
    const settings = await visibilityService.getSettings(candidateId);
    if (!settings.searchable_by_recruiters) {
      throw new Error('O candidato configurou seu perfil como restrito para buscas ativas de recrutadores.');
    }

    const now = new Date();

    // 3. Registra ou reaproveita o desbloqueio
    let unlock = await ContactUnlock.findOne({
      where: {
        organization_id: organizationId,
        candidate_id: candidateId
      }
    });

    if (!unlock) {
      unlock = await ContactUnlock.create({
        organization_id: organizationId,
        user_id: userId,
        candidate_id: candidateId,
        credit_source: 'plan_credit',
        unlocked_at: now,
        notified_candidate_at: now
      });

      // 4. Consome 1 crédito da organização
      await entitlementsService.incrementUsage(organizationId, 'contact_credits', 1);

      // 5. Notificação obrigatória ao candidato titular (LGPD)
      if (mqserver) {
        try {
          const notificationPayload = {
            action: 'contact_unlocked',
            type: 'PUSH',
            candidateId: candidateId,
            organizationId: organizationId,
            message: `Uma empresa contratante visualizou suas informações de contato profissional.`,
            timestamp: now
          };
          await mqserver.publishInQueue('notifications', JSON.stringify(notificationPayload));
        } catch (err) {
          console.error('Falha ao enviar notificação assíncrona de desbloqueio:', err);
        }
      }
    }

    return {
      unlocked: true,
      candidate: candidate,
      unlockedAt: unlock.unlocked_at,
      notifiedAt: unlock.notified_candidate_at
    };
  }
}

export const contactUnlockService = new ContactUnlockService();
