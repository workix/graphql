import { visibilityService } from '../../src/modules/candidates/services/visibility.service';
import { VisibilitySetting, ContactUnlock } from '../../src/models';

describe('Visibility Service - reveal() and Privacy Controls', () => {
  it('deve permitir acesso total quando o candidato visualiza o proprio perfil', async () => {
    const candidateId = 8881;
    const result = await visibilityService.reveal(candidateId, null, 'full_profile', true);
    expect(result.allow).toBe(true);
  });

  it('deve negar busca ativa quando searchable_by_recruiters for falso', async () => {
    const candidateId = 8882;
    await VisibilitySetting.create({
      candidate_id: candidateId,
      searchable_by_recruiters: false,
      open_to_work_visible: false,
      show_as_viewed: true
    });

    const result = await visibilityService.reveal(candidateId, 10, 'summary', false);
    expect(result.allow).toBe(false);
    expect(result.reason).toContain('não visível');
  });

  it('deve negar contato sem desbloqueio prévio em contact_unlocks', async () => {
    const candidateId = 8883;
    await VisibilitySetting.create({
      candidate_id: candidateId,
      searchable_by_recruiters: true,
      open_to_work_visible: true,
      show_as_viewed: true
    });

    const result = await visibilityService.reveal(candidateId, 20, 'contact', false);
    expect(result.allow).toBe(false);
    expect(result.reason).toContain('desbloqueio explícito');
  });

  it('deve permitir contato após registro em contact_unlocks', async () => {
    const candidateId = 8884;
    const orgId = 30;

    await VisibilitySetting.create({
      candidate_id: candidateId,
      searchable_by_recruiters: true,
      open_to_work_visible: true,
      show_as_viewed: true
    });

    await ContactUnlock.create({
      organization_id: orgId,
      candidate_id: candidateId,
      user_id: 1,
      credit_source: 'plan_credit',
      unlocked_at: new Date(),
      notified_candidate_at: new Date()
    });

    const result = await visibilityService.reveal(candidateId, orgId, 'contact', false);
    expect(result.allow).toBe(true);
  });
});
