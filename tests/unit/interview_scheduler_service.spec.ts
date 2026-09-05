import { interviewService } from '../../src/modules/interviews/services/interview.service';
import { Interview } from '../../src/models';
import { entitlementsService } from '../../src/modules/premium/services/entitlements.service';

jest.mock('../../src/models', () => {
  const mockInterviewModel = {
    create: jest.fn(),
    findByPk: jest.fn(),
    findAll: jest.fn(),
  };
  return {
    Interview: mockInterviewModel,
    Company: {},
    Candidate: {},
    Job: {},
  };
});

jest.mock('../../src/modules/premium/services/entitlements.service', () => ({
  entitlementsService: {
    can: jest.fn(),
  }
}));

describe('Interview Scheduler Service (Agenda de Entrevistas Premium)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Criação de Entrevista (createInterview)', () => {
    it('deve agendar uma entrevista com sucesso quando a empresa possui autorização Premium', async () => {
      (entitlementsService.can as jest.Mock).mockResolvedValue({ allow: true });

      const mockCreatedInterview = {
        id: 1,
        uuid: 'mock-uuid-123',
        company_id: 10,
        candidate_id: 20,
        job_id: 30,
        title: 'Entrevista Técnica React & Node.js',
        scheduled_at: new Date('2026-09-10T14:00:00Z'),
        duration_minutes: 60,
        format: 'ONLINE',
        meeting_link: 'https://meet.google.com/abc-defg-hij',
        status: 'SCHEDULED',
      };

      (Interview.create as jest.Mock).mockResolvedValue(mockCreatedInterview);

      const result = await interviewService.createInterview({
        companyId: 10,
        candidateId: 20,
        jobId: 30,
        title: 'Entrevista Técnica React & Node.js',
        scheduledAt: '2026-09-10T14:00:00Z',
        durationMinutes: 60,
        format: 'ONLINE',
        meetingLink: 'https://meet.google.com/abc-defg-hij',
      });

      expect(entitlementsService.can).toHaveBeenCalledWith(10, 'SCHEDULE_INTERVIEWS');
      expect(Interview.create).toHaveBeenCalledWith(expect.objectContaining({
        company_id: 10,
        candidate_id: 20,
        job_id: 30,
        title: 'Entrevista Técnica React & Node.js',
        status: 'SCHEDULED',
        format: 'ONLINE',
        meeting_link: 'https://meet.google.com/abc-defg-hij',
      }));
      expect(result).toEqual(mockCreatedInterview);
    });

    it('deve lançar erro quando a empresa não possui plano Premium para agendamento', async () => {
      (entitlementsService.can as jest.Mock).mockResolvedValue({
        allow: false,
        reason: 'O agendamento de entrevistas é exclusivo para empresas com plano Premium.',
      });

      await expect(
        interviewService.createInterview({
          companyId: 10,
          candidateId: 20,
          title: 'Entrevista Inicial',
          scheduledAt: '2026-09-10T10:00:00Z',
          format: 'ONLINE',
        })
      ).rejects.toThrow('O agendamento de entrevistas é exclusivo para empresas com plano Premium.');

      expect(Interview.create).not.toHaveBeenCalled();
    });
  });

  describe('Respostas e Ciclo de Vida da Entrevista', () => {
    it('deve permitir que o candidato confirme a entrevista', async () => {
      const mockInterviewInstance = {
        id: 1,
        status: 'SCHEDULED',
        update: jest.fn().mockImplementation((data) => {
          Object.assign(mockInterviewInstance, data);
          return Promise.resolve(mockInterviewInstance);
        }),
      };

      (Interview.findByPk as jest.Mock).mockResolvedValue(mockInterviewInstance);

      const result = await interviewService.respondInterview(1, {
        status: 'CONFIRMED',
        candidateFeedback: 'Confirmado, estarei presente!',
      });

      expect(mockInterviewInstance.update).toHaveBeenCalledWith({
        status: 'CONFIRMED',
        reschedule_reason: null,
        candidate_feedback: 'Confirmado, estarei presente!',
      });
      expect(result.status).toBe('CONFIRMED');
    });

    it('deve permitir que o candidato solicite reagendamento com justificativa', async () => {
      const mockInterviewInstance = {
        id: 2,
        status: 'SCHEDULED',
        update: jest.fn().mockImplementation((data) => {
          Object.assign(mockInterviewInstance, data);
          return Promise.resolve(mockInterviewInstance);
        }),
      };

      (Interview.findByPk as jest.Mock).mockResolvedValue(mockInterviewInstance);

      const result = await interviewService.respondInterview(2, {
        status: 'RESCHEDULE_REQUESTED',
        rescheduleReason: 'Tenho consulta médica no horário proposto. Posso no dia seguinte?',
      });

      expect(mockInterviewInstance.update).toHaveBeenCalledWith({
        status: 'RESCHEDULE_REQUESTED',
        reschedule_reason: 'Tenho consulta médica no horário proposto. Posso no dia seguinte?',
        candidate_feedback: null,
      });
      expect(result.status).toBe('RESCHEDULE_REQUESTED');
    });

    it('deve cancelar a entrevista com motivo registrado', async () => {
      const mockInterviewInstance = {
        id: 3,
        status: 'CONFIRMED',
        reschedule_reason: null,
        update: jest.fn().mockImplementation((data) => {
          Object.assign(mockInterviewInstance, data);
          return Promise.resolve(mockInterviewInstance);
        }),
      };

      (Interview.findByPk as jest.Mock).mockResolvedValue(mockInterviewInstance);

      const result = await interviewService.cancelInterview(3, 'Vaga preenchida internamente');

      expect(mockInterviewInstance.update).toHaveBeenCalledWith({
        status: 'CANCELLED',
        reschedule_reason: 'Vaga preenchida internamente',
      });
      expect(result.status).toBe('CANCELLED');
    });
  });
});
