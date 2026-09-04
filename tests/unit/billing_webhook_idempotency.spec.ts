import { billingGatewayService } from '../../src/modules/premium/services/billing_gateway.service';
import { WebhookEvent, Purchase, Invoice, Subscription, BillingAuditLog } from '../../src/models';

jest.mock('../../src/models', () => ({
  WebhookEvent: {
    findOne: jest.fn(),
    create: jest.fn()
  },
  Purchase: {
    findOne: jest.fn(),
    create: jest.fn()
  },
  Invoice: {
    create: jest.fn()
  },
  Subscription: {
    findOne: jest.fn(),
    findAll: jest.fn()
  },
  BillingAuditLog: {
    create: jest.fn()
  }
}));

describe('Billing Gateway Service - Webhook Idempotency and Invoicing', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve processar webhook e gerar fatura na primeira execucao', async () => {
    const orgId = 7771;
    const gatewayEventId = 'evt_test_1';
    const chargeId = 'ch_test_1';

    const mockPurchase = {
      id: 1,
      organization_id: orgId,
      amount_cents: 19900,
      update: jest.fn().mockResolvedValue(true)
    };

    const mockWebhook = {
      id: 10,
      update: jest.fn().mockResolvedValue(true)
    };

    (WebhookEvent.findOne as jest.Mock).mockResolvedValue(null);
    (WebhookEvent.create as jest.Mock).mockResolvedValue(mockWebhook);
    (Purchase.findOne as jest.Mock).mockResolvedValue(mockPurchase);
    (Invoice.create as jest.Mock).mockResolvedValue({ id: 100, status: 'paid' });
    (BillingAuditLog.create as jest.Mock).mockResolvedValue({});

    const result = await billingGatewayService.processWebhook(
      'asaas',
      gatewayEventId,
      'PAYMENT_RECEIVED',
      { chargeId, organizationId: orgId }
    );

    expect(result.status).toBe('processed');
    expect(mockPurchase.update).toHaveBeenCalled();
    expect(Invoice.create).toHaveBeenCalled();
  });

  it('deve ignorar webhook duplicado garantindo idempotencia total', async () => {
    const orgId = 7772;
    const gatewayEventId = 'evt_dup_1';

    (WebhookEvent.findOne as jest.Mock).mockResolvedValue({
      id: 20,
      processed_at: new Date()
    });

    const duplicateResult = await billingGatewayService.processWebhook(
      'asaas',
      gatewayEventId,
      'PAYMENT_RECEIVED',
      { chargeId: 'ch_dup', organizationId: orgId }
    );

    expect(duplicateResult.status).toBe('already_processed');
    expect(Purchase.findOne).not.toHaveBeenCalled();
  });
});
