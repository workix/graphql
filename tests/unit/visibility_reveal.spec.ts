import { visibilityService } from '../../src/modules/candidates/services/visibility.service';
import { VisibilitySetting, ContactUnlock, ProfileView } from '../../src/models';

jest.mock('../../src/models', () => ({
  VisibilitySetting: {
    findOne: jest.fn(),
    create: jest.fn()
  },
  ContactUnlock: {
    findOne: jest.fn(),
    create: jest.fn()
  },
  ProfileView: {
    create: jest.fn(),
    destroy: jest.fn()
  }
}));

describe('Visibility Service - reveal() and Privacy Controls', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve permitir acesso total quando o candidato visualiza o proprio perfil', async () => {
    const candidateId = 8881;
    const result = await visibilityService.reveal(candidateId, null, 'full_profile', true);
    expect(result.allow).toBe(true);
  });

  it('deve negar busca ativa quando searchable_by_recruiters for falso', async () => {
    const candidateId = 8882;
    (VisibilitySetting.findOne as jest.Mock).mockResolvedValue({
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
    (VisibilitySetting.findOne as jest.Mock).mockResolvedValue({
      candidate_id: candidateId,
      searchable_by_recruiters: true,
      open_to_work_visible: true,
      show_as_viewed: true
    });
    (ContactUnlock.findOne as jest.Mock).mockResolvedValue(null);

    const result = await visibilityService.reveal(candidateId, 20, 'contact', false);
    expect(result.allow).toBe(false);
    expect(result.reason).toContain('desbloqueio explícito');
  });

  it('deve permitir contato após registro em contact_unlocks', async () => {
    const candidateId = 8884;
    const orgId = 30;

    (VisibilitySetting.findOne as jest.Mock).mockResolvedValue({
      candidate_id: candidateId,
      searchable_by_recruiters: true,
      open_to_work_visible: true,
      show_as_viewed: true
    });
    (ContactUnlock.findOne as jest.Mock).mockResolvedValue({
      organization_id: orgId,
      candidate_id: candidateId
    });

    const result = await visibilityService.reveal(candidateId, orgId, 'contact', false);
    expect(result.allow).toBe(true);
  });
});
