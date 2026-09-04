import { Job, JobBoost, Purchase } from '../../../models';
import { entitlementsService } from '../../premium/services/entitlements.service';
import { Op } from 'sequelize';

export class JobBoostService {
  /**
   * Ativa impulsionamento/destaque para uma vaga
   */
  async boostJob(
    jobId: number,
    organizationId: number,
    durationDays: number = 7,
    source: 'plan_credit' | 'purchase' | 'founder_bonus' = 'plan_credit',
    purchaseId?: number
  ) {
    const job = await Job.findByPk(jobId);
    if (!job) {
      throw new Error(`Vaga com id ${jobId} não encontrada.`);
    }

    // 1. Valida se a organização tem capacidade para impulsionar
    if (source === 'plan_credit') {
      const canBoost = await entitlementsService.can(organizationId, 'boost_credits_monthly', 1);
      if (!canBoost.allow) {
        throw new Error(canBoost.reason || 'Saldo insuficiente de créditos de destaque.');
      }
    }

    // 2. Verifica slots concorrentes na mesma categoria (máximo 3)
    const activeBoostsInSlot = await JobBoost.count({
      where: {
        status: 'active',
        ends_at: { [Op.gt]: new Date() }
      }
    });

    const now = new Date();
    const endsAt = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000);

    // 3. Cria registro de JobBoost
    const boost = await JobBoost.create({
      job_id: jobId,
      organization_id: organizationId,
      source: source,
      purchase_id: purchaseId || null,
      starts_at: now,
      ends_at: endsAt,
      label: 'Patrocinada',
      max_concurrent_slot: 3,
      status: 'active'
    });

    // 4. Marca a vaga com rotulagem obrigatória
    await job.update({
      is_sponsored: true,
      sponsor_label: 'Patrocinada',
      updated_at: now
    });

    // 5. Incrementa consumo de créditos do plano se aplicável
    if (source === 'plan_credit') {
      await entitlementsService.incrementUsage(organizationId, 'boost_credits_monthly', 1);
    } else if (purchaseId) {
      const purchase = await Purchase.findByPk(purchaseId);
      if (purchase && purchase.credits_remaining > 0) {
        await purchase.decrement('credits_remaining', { by: 1 });
      }
    }

    return boost;
  }

  /**
   * Busca vagas separando claramente os slots de destaque do resultado orgânico
   */
  async getSponsoredAndOrganicList(options: any = {}) {
    const now = new Date();

    // 1. Slots de destaque (máximo 3 vagas com boost ativo)
    const sponsoredJobs = await Job.findAll({
      where: {
        activated: true,
        is_sponsored: true,
        outcome_status: 'OPEN'
      },
      limit: 3,
      order: [['updated_at', 'DESC']]
    });

    // 2. Lista orgânica completa e inalterada
    const organicOptions = {
      where: {
        activated: true,
        outcome_status: 'OPEN'
      },
      order: [['created_at', 'DESC']],
      ...options
    };

    const organicJobs = await Job.findAll(organicOptions);

    return {
      sponsoredJobs,
      organicJobs
    };
  }
}

export const jobBoostService = new JobBoostService();
