import { kanbanService } from '../services/kanban.service';
import CandidateDTO from '../../../dtos/CandidateDTO';
import { Candidate, KanbanCardHistory } from '../../../models';

const formatStageDTO = (stage: any) => {
  if (!stage) return null;
  const raw = stage.toJSON ? stage.toJSON() : stage;
  return {
    id: raw.id,
    uuid: raw.uuid,
    companyId: raw.company_id || raw.companyId,
    jobId: raw.job_id || raw.jobId,
    name: raw.name,
    color: raw.color,
    orderPosition: raw.order_position || raw.orderPosition,
    isSystemStage: Boolean(raw.is_system_stage ?? raw.isSystemStage),
    cards: (raw.cards || []).map(formatCardDTO),
    createdAt: raw.created_at || raw.createdAt,
    updatedAt: raw.updated_at || raw.updatedAt,
  };
};

const formatCardDTO = (card: any) => {
  if (!card) return null;
  const raw = card.toJSON ? card.toJSON() : card;
  let parsedTags: string[] = [];
  if (Array.isArray(raw.tags)) {
    parsedTags = raw.tags;
  } else if (typeof raw.tags === 'string') {
    try {
      parsedTags = JSON.parse(raw.tags);
    } catch {
      parsedTags = [];
    }
  }

  return {
    id: raw.id,
    uuid: raw.uuid,
    stageId: raw.stage_id || raw.stageId,
    candidateId: raw.candidate_id || raw.candidateId,
    jobId: raw.job_id || raw.jobId,
    orderPosition: raw.order_position || raw.orderPosition,
    rating: raw.rating,
    notes: raw.notes,
    tags: parsedTags,
    candidate: raw.candidate,
    histories: (raw.histories || []).map(formatHistoryDTO),
    createdAt: raw.created_at || raw.createdAt,
    updatedAt: raw.updated_at || raw.updatedAt,
  };
};

const formatHistoryDTO = (history: any) => {
  if (!history) return null;
  const raw = history.toJSON ? history.toJSON() : history;
  return {
    id: raw.id,
    cardId: raw.card_id || raw.cardId,
    fromStageId: raw.from_stage_id || raw.fromStageId,
    toStageId: raw.to_stage_id || raw.toStageId,
    movedByUserId: raw.moved_by_user_id || raw.movedByUserId,
    notes: raw.notes,
    createdAt: raw.created_at || raw.createdAt,
  };
};

const kanbanResolvers = {
  Query: {
    getRecruitmentBoard: async (_parent: any, args: { jobId: string; companyId: string }) => {
      const board = await kanbanService.getBoardByJob(
        parseInt(args.jobId, 10),
        parseInt(args.companyId, 10)
      );
      return {
        jobId: board.jobId,
        companyId: board.companyId,
        stages: board.stages.map(formatStageDTO),
      };
    },
  },
  Mutation: {
    createKanbanStage: async (_parent: any, args: { input: any }) => {
      const stage = await kanbanService.createStage({
        companyId: parseInt(args.input.companyId, 10),
        jobId: args.input.jobId ? parseInt(args.input.jobId, 10) : null,
        name: args.input.name,
        color: args.input.color,
        orderPosition: args.input.orderPosition,
      });
      return formatStageDTO(stage);
    },
    updateKanbanStage: async (_parent: any, args: { id: string; input: any }) => {
      const stage = await kanbanService.updateStage(parseInt(args.id, 10), args.input);
      return formatStageDTO(stage);
    },
    reorderKanbanStages: async (_parent: any, args: { companyId: string; jobId?: string; stageIds: string[] }) => {
      const stages = await kanbanService.reorderStages(
        parseInt(args.companyId, 10),
        args.jobId ? parseInt(args.jobId, 10) : null,
        args.stageIds.map(id => parseInt(id, 10))
      );
      return stages.map(formatStageDTO);
    },
    moveKanbanCard: async (_parent: any, args: { input: any }, ctx: any) => {
      const card = await kanbanService.moveCard({
        cardId: parseInt(args.input.cardId, 10),
        targetStageId: parseInt(args.input.targetStageId, 10),
        targetPosition: args.input.targetPosition,
        movedByUserId: ctx?.user?.id || null,
        notes: args.input.notes,
      });
      return formatCardDTO(card);
    },
    updateKanbanCard: async (_parent: any, args: { id: string; input: any }) => {
      const card = await kanbanService.updateCard(parseInt(args.id, 10), args.input);
      return formatCardDTO(card);
    },
    addCandidateToBoard: async (_parent: any, args: { input: any }) => {
      const card = await kanbanService.addCandidateToBoard(
        parseInt(args.input.companyId, 10),
        parseInt(args.input.jobId, 10),
        parseInt(args.input.candidateId, 10),
        args.input.stageId ? parseInt(args.input.stageId, 10) : undefined
      );
      return formatCardDTO(card);
    },
  },
  KanbanCard: {
    candidate: async (parent: any, _args: any, ctx: any, info: any) => {
      if (parent.candidate) return new CandidateDTO(parent.candidate);
      if (!parent.candidateId) return null;
      if (ctx?.dataloaders?.candidatesLoader) {
        const candidates = await ctx.dataloaders.candidatesLoader.load({ key: parent.candidateId, info });
        return candidates && candidates[0] ? new CandidateDTO(candidates[0]) : null;
      }
      const candidate = await Candidate.findByPk(parent.candidateId);
      return candidate ? new CandidateDTO(candidate) : null;
    },
    histories: async (parent: any) => {
      if (parent.histories && parent.histories.length > 0) return parent.histories;
      if (!parent.id) return [];
      const histories = await KanbanCardHistory.findAll({
        where: { card_id: parent.id },
        order: [['created_at', 'ASC']],
      });
      return histories.map(formatHistoryDTO);
    },
  },
};

export default kanbanResolvers;
