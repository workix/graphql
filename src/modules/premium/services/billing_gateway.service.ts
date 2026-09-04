import { WebhookEvent, Invoice, Purchase, Subscription, BillingAuditLog, Plan } from '../../../models';
import { entitlementsService } from './entitlements.service';
import { Op } from 'sequelize';

export interface PixChargeResponse {
  purchaseId: number;
  amountCents: number;
  qrCode: string;
  copyPastePix: string;
  gatewayChargeId: string;
}

export class BillingGatewayService {
  /**
   * Cria cobrança avulsa via Pix para compra de destaque ou pacotes
   */
  async createPixCharge(
    organizationId: number,
    sku: string,
    amountCents: number,
    creditsCount: number = 1
  ): Promise<PixChargeResponse> {
    const mockChargeId = `charge_pix_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const mockQrCode = `https://pix.workix.com.br/qr/${mockChargeId}`;
    const mockCopyPaste = `00020126580014BR.GOV.BCB.PIX0136workix-${mockChargeId}5204000053039865405${(amountCents / 100).toFixed(2)}5802BR5906WORKIX6009SAO_PAULO62070503***6304`;

    const purchase = await Purchase.create({
      organization_id: organizationId,
      sku: sku,
      amount_cents: amountCents,
      gateway_charge_id: mockChargeId,
      status: 'pending',
      credits_granted: creditsCount,
      credits_remaining: creditsCount
    });

    return {
      purchaseId: purchase.id,
      amountCents: amountCents,
      qrCode: mockQrCode,
      copyPastePix: mockCopyPaste,
      gatewayChargeId: mockChargeId
    };
  }

  /**
   * Processador central de webhooks com idempotência garantida e auditoria
   */
  async processWebhook(gateway: string, gatewayEventId: string, eventType: string, payload: any) {
    // 1. Verificação de idempotência: se o evento já foi gravado e processado, ignora
    const existingEvent = await WebhookEvent.findOne({
      where: {
        gateway_event_id: gatewayEventId
      }
    });

    if (existingEvent && existingEvent.processed_at) {
      return { status: 'already_processed', eventId: existingEvent.id };
    }

    let webhookRecord = existingEvent;
    if (!webhookRecord) {
      webhookRecord = await WebhookEvent.create({
        gateway: gateway,
        gateway_event_id: gatewayEventId,
        type: eventType,
        payload_json: typeof payload === 'string' ? payload : JSON.stringify(payload),
        received_at: new Date()
      });
    }

    try {
      const now = new Date();

      // 2. Tratamento por tipo de evento do gateway
      if (eventType === 'PAYMENT_RECEIVED' || eventType === 'PAYMENT_CONFIRMED') {
        const gatewayChargeId = payload.chargeId || payload.id;
        const orgId = payload.organizationId || payload.orgId;

        // Se for compra avulsa (Pix/Destaque)
        if (gatewayChargeId) {
          const purchase = await Purchase.findOne({ where: { gateway_charge_id: gatewayChargeId } });
          if (purchase) {
            await purchase.update({
              status: 'completed',
              purchased_at: now,
              updated_at: now
            });

            await Invoice.create({
              organization_id: purchase.organization_id,
              amount_cents: purchase.amount_cents,
              status: 'paid',
              gateway_invoice_id: gatewayChargeId,
              nfse_number: `NFS-${now.getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`,
              nfse_url: `https://nfe.workix.com.br/pdf/${gatewayChargeId}`,
              due_date: now,
              paid_at: now
            });
          }
        }

        // Se for pagamento de assinatura
        if (orgId) {
          const subscription = await Subscription.findOne({ where: { organization_id: orgId } });
          if (subscription) {
            const nextPeriodEnd = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
            await subscription.update({
              status: 'active',
              current_period_start: now,
              current_period_end: nextPeriodEnd,
              updated_at: now
            });
          }
        }
      } else if (eventType === 'PAYMENT_OVERDUE' || eventType === 'PAYMENT_FAILED') {
        const orgId = payload.organizationId || payload.orgId;
        if (orgId) {
          const subscription = await Subscription.findOne({ where: { organization_id: orgId } });
          if (subscription && subscription.status === 'active') {
            // Entra no período de carência (past_due - 7 dias)
            await subscription.update({
              status: 'past_due',
              updated_at: now
            });
          }
        }
      } else if (eventType === 'SUBSCRIPTION_CANCELED') {
        const orgId = payload.organizationId || payload.orgId;
        if (orgId) {
          const subscription = await Subscription.findOne({ where: { organization_id: orgId } });
          if (subscription) {
            await subscription.update({
              status: 'canceled',
              cancel_at_period_end: true,
              updated_at: now
            });
            // Executa degradação suave de capacidade
            await entitlementsService.gracefulDowngrade(orgId);
          }
        }
      }

      // 3. Marca webhook como processado
      await webhookRecord.update({
        processed_at: now,
        updated_at: now
      });

      // 4. Grava na trilha de auditoria
      await BillingAuditLog.create({
        organization_id: payload.organizationId || 0,
        actor: `gateway:${gateway}`,
        action: `webhook:${eventType}`,
        after_json: JSON.stringify({ gatewayEventId, eventType, timestamp: now }),
        at: now
      });

      return { status: 'processed', eventId: webhookRecord.id };
    } catch (error: any) {
      await webhookRecord.update({
        error: error.message,
        updated_at: new Date()
      });
      throw error;
    }
  }

  /**
   * Job diário de Dunning (recuperação de cobrança e cancelamento após carência de 7 dias)
   */
  async dunningDailyJob() {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    // Assinaturas vencidas há mais de 7 dias são rebaixadas para Free com degradação suave
    const overdueSubs = await Subscription.findAll({
      where: {
        status: 'past_due',
        updated_at: {
          [Op.lt]: sevenDaysAgo
        }
      }
    });

    const processedOrgs: number[] = [];

    for (const sub of overdueSubs) {
      await sub.update({
        status: 'canceled',
        updated_at: new Date()
      });

      await entitlementsService.gracefulDowngrade(sub.organization_id);
      processedOrgs.push(sub.organization_id);
    }

    return {
      downgradedCount: processedOrgs.length,
      organizationIds: processedOrgs
    };
  }
}

export const billingGatewayService = new BillingGatewayService();
