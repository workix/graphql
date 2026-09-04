import { Plan, PlanFeature, Subscription, SubscriptionOverride, UsageCounter, Job, Purchase } from '../../../models';
import { Op } from 'sequelize';

export interface CanResult {
  allow: boolean;
  reason?: string;
  upgradeTo?: string;
  limit?: number | null;
  currentUsage?: number;
}

export class EntitlementsService {
  /**
   * Obtém a assinatura ativa ou o plano padrão FREE da organização
   */
  async getEffectivePlan(organizationId: number) {
    const activeSub = await Subscription.findOne({
      where: {
        organization_id: organizationId,
        status: {
          [Op.in]: ['active', 'trialing', 'past_due']
        }
      },
      include: [{ model: Plan, as: 'plan', include: [{ model: PlanFeature, as: 'features' }] }]
    });

    if (activeSub && activeSub.plan) {
      return { subscription: activeSub, plan: activeSub.plan };
    }

    // Fallback: Plano Free
    const freePlan = await Plan.findOne({
      where: { code: 'free_v1' },
      include: [{ model: PlanFeature, as: 'features' }]
    });

    return { subscription: null, plan: freePlan };
  }

  /**
   * Função centralizada server-side de autorização de capacidade can()
   */
  async can(organizationId: number, featureKey: string, quantity: number = 1): Promise<CanResult> {
    const { subscription, plan } = await this.getEffectivePlan(organizationId);

    if (!plan) {
      return { allow: false, reason: 'Nenhum plano configurado no sistema.' };
    }

    // 1. Verifica overrides pontuais (cortesias/fundador)
    if (subscription) {
      const override = await SubscriptionOverride.findOne({
        where: {
          subscription_id: subscription.id,
          feature_key: featureKey,
          [Op.or]: [
            { expires_at: null },
            { expires_at: { [Op.gt]: new Date() } }
          ]
        }
      });

      if (override) {
        if (override.limit_value === null) return { allow: true, limit: null };
        const usage = await this.getCurrentUsage(organizationId, featureKey);
        if (usage + quantity <= override.limit_value) {
          return { allow: true, limit: override.limit_value, currentUsage: usage };
        }
      }
    }

    // 2. Busca limite do plano em plan_features
    const feature = await PlanFeature.findOne({
      where: {
        plan_id: plan.id,
        feature_key: featureKey,
        enabled: true
      }
    });

    if (!feature) {
      // Recurso não habilitado no plano
      const upgradePlan = plan.code === 'free_v1' ? 'starter_v1' : (plan.code === 'starter_v1' ? 'pro_v1' : 'business_v1');
      return {
        allow: false,
        reason: `O recurso '${featureKey}' não está disponível no plano ${plan.name}.`,
        upgradeTo: upgradePlan
      };
    }

    // Limite ilimitado
    if (feature.limit_value === null) {
      return { allow: true, limit: null };
    }

    // 3. Validações específicas por tipo de recurso
    if (featureKey === 'max_active_jobs') {
      const activeJobsCount = await Job.count({
        where: {
          company_id: organizationId,
          activated: true,
          outcome_status: 'OPEN'
        }
      });

      if (activeJobsCount + quantity > feature.limit_value) {
        const upgradePlan = plan.code === 'free_v1' ? 'starter_v1' : (plan.code === 'starter_v1' ? 'pro_v1' : 'business_v1');
        return {
          allow: false,
          reason: `Limite de ${feature.limit_value} vagas ativas simultâneas atingido no plano ${plan.name}.`,
          upgradeTo: upgradePlan,
          limit: feature.limit_value,
          currentUsage: activeJobsCount
        };
      }

      return { allow: true, limit: feature.limit_value, currentUsage: activeJobsCount };
    }

    // Contadores com janela (contact_credits, boost_credits_monthly)
    const currentUsage = await this.getCurrentUsage(organizationId, featureKey);

    // Soma créditos avulsos comprados restantes
    let extraPurchasedCredits = 0;
    const purchased = await Purchase.findAll({
      where: {
        organization_id: organizationId,
        status: 'completed',
        credits_remaining: { [Op.gt]: 0 }
      }
    });
    extraPurchasedCredits = purchased.reduce((acc: number, p: any) => acc + (p.credits_remaining || 0), 0);

    const totalAllowed = feature.limit_value + extraPurchasedCredits;

    if (currentUsage + quantity > totalAllowed) {
      const upgradePlan = plan.code === 'free_v1' ? 'starter_v1' : (plan.code === 'starter_v1' ? 'pro_v1' : 'business_v1');
      return {
        allow: false,
        reason: `Limite de créditos de '${featureKey}' excedido (${currentUsage}/${totalAllowed}).`,
        upgradeTo: upgradePlan,
        limit: totalAllowed,
        currentUsage
      };
    }

    return { allow: true, limit: totalAllowed, currentUsage };
  }

  /**
   * Obtém o uso corrente no período atual
   */
  async getCurrentUsage(organizationId: number, featureKey: string): Promise<number> {
    const now = new Date();
    const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const counter = await UsageCounter.findOne({
      where: {
        organization_id: organizationId,
        feature_key: featureKey,
        period_start: { [Op.lte]: now },
        period_end: { [Op.gte]: now }
      }
    });

    return counter ? counter.used : 0;
  }

  /**
   * Incrementa o contador de uso
   */
  async incrementUsage(organizationId: number, featureKey: string, quantity: number = 1) {
    const now = new Date();
    const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    let counter = await UsageCounter.findOne({
      where: {
        organization_id: organizationId,
        feature_key: featureKey,
        period_start: { [Op.lte]: now },
        period_end: { [Op.gte]: now }
      }
    });

    if (!counter) {
      counter = await UsageCounter.create({
        organization_id: organizationId,
        feature_key: featureKey,
        period_start: periodStart,
        period_end: periodEnd,
        used: quantity
      });
    } else {
      await counter.increment('used', { by: quantity });
      await counter.reload();
    }

    return counter;
  }

  /**
   * Degradação suave no downgrade de plano (preserva dados e arquiva vagas excedentes)
   */
  async gracefulDowngrade(organizationId: number) {
    const { plan } = await this.getEffectivePlan(organizationId);
    if (!plan) return;

    const maxJobsFeature = await PlanFeature.findOne({
      where: { plan_id: plan.id, feature_key: 'max_active_jobs' }
    });

    const allowedJobs = maxJobsFeature && maxJobsFeature.limit_value !== null ? maxJobsFeature.limit_value : 1;

    const activeJobs = await Job.findAll({
      where: {
        company_id: organizationId,
        activated: true,
        outcome_status: 'OPEN'
      },
      order: [['created_at', 'DESC']]
    });

    if (activeJobs.length > allowedJobs) {
      const jobsToArchive = activeJobs.slice(allowedJobs);
      for (const job of jobsToArchive) {
        await job.update({
          activated: false,
          outcome_status: 'CLOSED',
          updated_at: new Date()
        });
      }
    }
  }
}

export const entitlementsService = new EntitlementsService();
