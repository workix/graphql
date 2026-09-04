import { billingGatewayService } from '../../src/modules/premium/services/billing_gateway.service';
import { WebhookEvent, Purchase, Invoice, Subscription } from '../../src/models';

describe('Billing Gateway Service - Webhook Idempotency and Invoicing', () => {
  it('deve processar webhook e gerar fatura na primeira execucao', async () => {
    const orgId = 7771;
    const gatewayEventId = `evt_test_${Date.now()}`;
    const chargeId = `ch_test_${Date.now()}`;

    await Purchase.create({
      organization_id: orgId,
      sku: 'boost_pack_5',
      amount_cents: 19900,
      gateway_charge_id: chargeId,
      status: 'pending',
      credits_granted: 5,
      credits_remaining: 5
    });

    const result = await billingGatewayService.processWebhook(
      'asaas',
      gatewayEventId,
      'PAYMENT_RECEIVED',
      { chargeId, organizationId: orgId }
    );

    expect(result.status).toBe('processed');

    const purchase = await Purchase.findOne({ where: { gateway_charge_id: chargeId } });
    expect(purchase.status).toBe('completed');

    const invoice = await Invoice.findOne({ where: { gateway_invoice_id: chargeId } });
    expect(invoice).not.toBeNull();
    expect(invoice.status).toBe('paid');
  });

  it('deve ignorar webhook duplicado garantindo idempotencia total', async () => {
    const orgId = 7772;
    const gatewayEventId = `evt_dup_${Date.now()}`;
    const chargeId = `ch_dup_${Date.now()}`;

    // Primeira execução
    await billingGatewayService.processWebhook(
      'asaas',
      gatewayEventId,
      'PAYMENT_RECEIVED',
      { chargeId, organizationId: orgId }
    );

    // Segunda execução com mesmo gatewayEventId
    const duplicateResult = await billingGatewayService.processWebhook(
      'asaas',
      gatewayEventId,
      'PAYMENT_RECEIVED',
      { chargeId, organizationId: orgId }
    );

    expect(duplicateResult.status).toBe('already_processed');
  });
});
