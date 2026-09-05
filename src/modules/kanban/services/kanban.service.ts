import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize';
import { KanbanStage, KanbanCard, KanbanCardHistory, Candidate, Job, Company } from '../../../models';
import { entitlementsService } from '../../premium/services/entitlements.service';

export interface CreateKanbanStageInput {
  companyId: number;
  jobId?: number | null;
  name: string;
  color?: string;
  orderPosition?: number;
}

export interface UpdateKanbanStageInput {
  name?: string;
  color?: string;
  orderPosition?: number;
}

export interface MoveKanbanCardInput {
  cardId: number;
  targetStageId: number;
  targetPosition?: number;
  movedByUserId?: number | null;
  notes?: string | null;
}

export interface UpdateKanbanCardInput {
  rating?: number | null;
  notes?: string | null;
  tags?: string[];
}

export const DEFAULT_KANBAN_STAGES = [
  { name: 'Inscritos', color: '#6366F1', order_position: 1, is_system_stage: true },
  { name: 'Triagem', color: '#3B82F6', order_position: 2, is_system_stage: true },
  { name: 'Entrevista', color: '#F59E0B', order_position: 3, is_system_stage: true },
  { name: 'Proposta', color: '#8B5CF6', order_position: 4, is_system_stage: true },
  { name: 'Contratado', color: '#10B981', order_position: 5, is_system_stage: true },
  { name: 'Desqualificado', color: '#EF4444', order_position: 6, is_system_stage: true },
];

export class KanbanService {
  /**
   * Garante que a empresa ou vaga possui estágios padrão configurados
   */
  async ensureDefaultStages(companyId: number, jobId?: number | null) {
    const existingStages = await KanbanStage.findAll({
      where: {
        company_id: companyId,
        job_id: jobId || null,
      },
      order: [['order_position', 'ASC']],
    });

    if (existingStages.length > 0) {
      return existingStages;
    }

    // Criar estágios padrão
    const createdStages: any[] = [];
    for (const def of DEFAULT_KANBAN_STAGES) {
      const stage = await KanbanStage.create({
        uuid: uuidv4(),
        company_id: companyId,
        job_id: jobId || null,
        name: def.name,
        color: def.color,
        order_position: def.order_position,
        is_system_stage: def.is_system_stage,
      });
      createdStages.push(stage);
    }

    return createdStages;
  }

  /**
   * Carrega o quadro completo (stages com seus respectivos cards e candidatos)
   */
  async getBoardByJob(jobId: number, companyId: number) {
    // 1. Garante estágios
    const stages = await this.ensureDefaultStages(companyId, jobId);
    const stageIds = stages.map(s => s.id);

    // 2. Busca todos os cards da vaga
    const cards = await KanbanCard.findAll({
      where: {
        job_id: jobId,
        stage_id: { [Op.in]: stageIds },
      },
      order: [['order_position', 'ASC']],
      include: [
        { model: Candidate, as: 'candidate' },
        { model: KanbanCardHistory, as: 'histories' },
      ],
    });

    // 3. Monta estrutura
    const stagesWithCards = stages.map(stage => {
      const stageCards = cards.filter(c => c.stage_id === stage.id);
      return {
        ...stage.toJSON(),
        cards: stageCards,
      };
    });

    return {
      jobId,
      companyId,
      stages: stagesWithCards,
    };
  }

  /**
   * Cria um novo estágio no quadro Kanban validando entitlement Premium
   */
  async createStage(input: CreateKanbanStageInput) {
    // Validação Premium
    const entitlement = await entitlementsService.can(input.companyId, 'USE_RECRUITMENT_KANBAN');
    if (!entitlement.allow) {
      const alt = await entitlementsService.can(input.companyId, 'recruitment_kanban');
      if (!alt.allow) {
        throw new Error(entitlement.reason || 'O uso do Kanban de Triagem é exclusivo para empresas com plano Premium.');
      }
    }

    let orderPos = input.orderPosition;
    if (orderPos === undefined || orderPos === null) {
      const maxStage = await KanbanStage.findOne({
        where: { company_id: input.companyId, job_id: input.jobId || null },
        order: [['order_position', 'DESC']],
      });
      orderPos = maxStage ? maxStage.order_position + 1 : 1;
    }

    return await KanbanStage.create({
      uuid: uuidv4(),
      company_id: input.companyId,
      job_id: input.jobId || null,
      name: input.name,
      color: input.color || '#3B82F6',
      order_position: orderPos,
      is_system_stage: false,
    });
  }

  /**
   * Atualiza uma coluna existente
   */
  async updateStage(id: number, input: UpdateKanbanStageInput) {
    const stage = await KanbanStage.findByPk(id);
    if (!stage) {
      throw new Error(`Estágio Kanban #${id} não encontrado.`);
    }

    const updateData: any = {};
    if (input.name !== undefined) updateData.name = input.name;
    if (input.color !== undefined) updateData.color = input.color;
    if (input.orderPosition !== undefined) updateData.order_position = input.orderPosition;

    await stage.update(updateData);
    return stage;
  }

  /**
   * Reordena as colunas do quadro
   */
  async reorderStages(companyId: number, jobId: number | null, stageIdsInOrder: number[]) {
    for (let index = 0; index < stageIdsInOrder.length; index++) {
      const stageId = stageIdsInOrder[index];
      await KanbanStage.update(
        { order_position: index + 1 },
        { where: { id: stageId, company_id: companyId, job_id: jobId || null } }
      );
    }
    return await KanbanStage.findAll({
      where: { company_id: companyId, job_id: jobId || null },
      order: [['order_position', 'ASC']],
    });
  }

  /**
   * Move um candidato para outra etapa do funil e registra auditoria histórica
   */
  async moveCard(input: MoveKanbanCardInput) {
    const card = await KanbanCard.findByPk(input.cardId);
    if (!card) {
      throw new Error(`Card #${input.cardId} não encontrado.`);
    }

    const fromStageId = card.stage_id;
    const toStageId = input.targetStageId;

    if (fromStageId !== toStageId) {
      // 1. Registrar histórico auditável de transição
      await KanbanCardHistory.create({
        card_id: card.id,
        from_stage_id: fromStageId,
        to_stage_id: toStageId,
        moved_by_user_id: input.movedByUserId || null,
        notes: input.notes || null,
      });

      // 2. Atualizar estágio e posição
      await card.update({
        stage_id: toStageId,
        order_position: input.targetPosition !== undefined ? input.targetPosition : card.order_position,
      });
    } else if (input.targetPosition !== undefined) {
      await card.update({ order_position: input.targetPosition });
    }

    return card;
  }

  /**
   * Atualiza notas, rating ou tags de um card
   */
  async updateCard(id: number, input: UpdateKanbanCardInput) {
    const card = await KanbanCard.findByPk(id);
    if (!card) {
      throw new Error(`Card #${id} não encontrado.`);
    }

    const updateData: any = {};
    if (input.rating !== undefined) updateData.rating = input.rating;
    if (input.notes !== undefined) updateData.notes = input.notes;
    if (input.tags !== undefined) updateData.tags = JSON.stringify(input.tags);

    await card.update(updateData);
    return card;
  }

  /**
   * Adiciona um candidato ao quadro da vaga
   */
  async addCandidateToBoard(companyId: number, jobId: number, candidateId: number, stageId?: number) {
    // Validação Premium
    const entitlement = await entitlementsService.can(companyId, 'USE_RECRUITMENT_KANBAN');
    if (!entitlement.allow) {
      const alt = await entitlementsService.can(companyId, 'recruitment_kanban');
      if (!alt.allow) {
        throw new Error(entitlement.reason || 'O uso do Kanban de Triagem é exclusivo para empresas com plano Premium.');
      }
    }

    let targetStageId = stageId;
    if (!targetStageId) {
      const stages = await this.ensureDefaultStages(companyId, jobId);
      targetStageId = stages[0].id;
    }

    const existingCard = await KanbanCard.findOne({
      where: { job_id: jobId, candidate_id: candidateId },
    });

    if (existingCard) {
      return existingCard;
    }

    const maxCard = await KanbanCard.findOne({
      where: { stage_id: targetStageId },
      order: [['order_position', 'DESC']],
    });
    const orderPos = maxCard ? maxCard.order_position + 1 : 1;

    const card = await KanbanCard.create({
      uuid: uuidv4(),
      stage_id: targetStageId,
      candidate_id: candidateId,
      job_id: jobId,
      order_position: orderPos,
      rating: null,
      notes: null,
      tags: '[]',
    });

    // Registra entrada inicial no histórico
    await KanbanCardHistory.create({
      card_id: card.id,
      from_stage_id: null,
      to_stage_id: targetStageId,
      moved_by_user_id: null,
      notes: 'Candidato inscrito / adicionado ao pipeline',
    });

    return card;
  }
}

export const kanbanService = new KanbanService();
