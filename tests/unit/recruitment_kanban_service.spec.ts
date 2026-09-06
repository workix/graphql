import { kanbanService } from '../../src/modules/kanban/services/kanban.service';
import { KanbanStage, KanbanCard, KanbanCardHistory } from '../../src/models';
import { entitlementsService } from '../../src/modules/premium/services/entitlements.service';

jest.mock('../../src/models', () => {
  const mockKanbanStage = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };
  const mockKanbanCard = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };
  const mockKanbanCardHistory = {
    create: jest.fn(),
    findAll: jest.fn(),
  };
  return {
    KanbanStage: mockKanbanStage,
    KanbanCard: mockKanbanCard,
    KanbanCardHistory: mockKanbanCardHistory,
    Candidate: {},
    Job: {},
    Company: {},
  };
});

jest.mock('../../src/modules/premium/services/entitlements.service', () => ({
  entitlementsService: {
    can: jest.fn(),
  }
}));

describe('Recruitment Kanban Service (Quadro de Triagem de Candidatos)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Estágios e Criação (ensureDefaultStages & createStage)', () => {
    it('deve inicializar estágios padrão caso nenhum exista para a vaga', async () => {
      (KanbanStage.findAll as jest.Mock).mockResolvedValue([]);
      (KanbanStage.create as jest.Mock).mockImplementation((data) => Promise.resolve({
        id: Math.floor(Math.random() * 100),
        toJSON: () => data,
        ...data,
      }));

      const stages = await kanbanService.ensureDefaultStages(10, 50);

      expect(KanbanStage.findAll).toHaveBeenCalledWith({
        where: { company_id: 10, job_id: 50 },
        order: [['order_position', 'ASC']],
      });
      expect(KanbanStage.create).toHaveBeenCalledTimes(6); // 6 estágios padrão
      expect(stages.length).toBe(6);
    });

    it('deve permitir criar um novo estágio quando a empresa tiver autorização Premium', async () => {
      (entitlementsService.can as jest.Mock).mockResolvedValue({ allow: true });
      (KanbanStage.findOne as jest.Mock).mockResolvedValue({ order_position: 4 });
      (KanbanStage.create as jest.Mock).mockResolvedValue({
        id: 99,
        name: 'Desafio Prático',
        color: '#10B981',
        order_position: 5,
        company_id: 10,
        job_id: 50,
      });

      const stage = await kanbanService.createStage({
        companyId: 10,
        jobId: 50,
        name: 'Desafio Prático',
        color: '#10B981',
      });

      expect(entitlementsService.can).toHaveBeenCalledWith(10, 'USE_RECRUITMENT_KANBAN');
      expect(KanbanStage.create).toHaveBeenCalledWith(expect.objectContaining({
        name: 'Desafio Prático',
        color: '#10B981',
        order_position: 5,
      }));
      expect(stage.name).toBe('Desafio Prático');
    });

    it('deve bloquear a criação de estágio se o plano corporativo não possuir a capability', async () => {
      (entitlementsService.can as jest.Mock).mockResolvedValue({
        allow: false,
        reason: 'O uso do Kanban de Triagem é exclusivo para empresas com plano Premium.',
      });

      await expect(
        kanbanService.createStage({
          companyId: 10,
          name: 'Entrevista com Diretoria',
        })
      ).rejects.toThrow('O uso do Kanban de Triagem é exclusivo para empresas com plano Premium.');

      expect(KanbanStage.create).not.toHaveBeenCalled();
    });
  });

  describe('Movimentação de Cards e Auditoria de Histórico (moveCard)', () => {
    it('deve mover o card de estágio e gravar histórico na tabela kanban_card_histories', async () => {
      const mockCardInstance = {
        id: 7,
        stage_id: 1, // 'Inscritos'
        order_position: 1,
        update: jest.fn().mockImplementation((data) => {
          Object.assign(mockCardInstance, data);
          return Promise.resolve(mockCardInstance);
        }),
      };

      (KanbanCard.findByPk as jest.Mock).mockResolvedValue(mockCardInstance);
      (KanbanCardHistory.create as jest.Mock).mockResolvedValue({ id: 101 });

      const movedCard = await kanbanService.moveCard({
        cardId: 7,
        targetStageId: 3, // 'Entrevista'
        targetPosition: 2,
        movedByUserId: 15,
        notes: 'Candidato pré-selecionado pelo recrutador',
      });

      expect(KanbanCardHistory.create).toHaveBeenCalledWith({
        card_id: 7,
        from_stage_id: 1,
        to_stage_id: 3,
        user_id: 15,
        moved_by_user_id: 15,
        notes: 'Candidato pré-selecionado pelo recrutador',
      });

      expect(mockCardInstance.update).toHaveBeenCalledWith({
        stage_id: 3,
        order_position: 2,
        position_order: 2,
        notes: 'Candidato pré-selecionado pelo recrutador',
      });

      expect(movedCard.stage_id).toBe(3);
    });
  });
});
