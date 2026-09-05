import graphqlClient from './graphql';

export interface KanbanCardHistoryModel {
  id: string | number;
  cardId: string | number;
  fromStageId?: string | number | null;
  toStageId: string | number;
  movedByUserId?: string | number | null;
  notes?: string | null;
  createdAt: string;
}

export interface KanbanCardModel {
  id: string | number;
  uuid: string;
  stageId: string | number;
  candidateId: string | number;
  jobId?: string | number | null;
  orderPosition: number;
  rating?: number | null;
  notes?: string | null;
  tags: string[];
  candidate?: {
    id: string | number;
    name: string;
    city?: string;
  };
  histories?: KanbanCardHistoryModel[];
  createdAt: string;
}

export interface KanbanStageModel {
  id: string | number;
  uuid: string;
  companyId: string | number;
  jobId?: string | number | null;
  name: string;
  color: string;
  orderPosition: number;
  isSystemStage: boolean;
  cards: KanbanCardModel[];
}

export interface KanbanBoardModel {
  jobId: string | number;
  companyId: string | number;
  stages: KanbanStageModel[];
}

export const kanbanService = {
  async getBoard(jobId: string | number, companyId: string | number): Promise<{ data: KanbanBoardModel }> {
    const query = `
      query GetRecruitmentBoard($jobId: ID!, $companyId: ID!) {
        getRecruitmentBoard(jobId: $jobId, companyId: $companyId) {
          jobId
          companyId
          stages {
            id
            uuid
            companyId
            jobId
            name
            color
            orderPosition
            isSystemStage
            cards {
              id
              uuid
              stageId
              candidateId
              jobId
              orderPosition
              rating
              notes
              tags
              candidate { id name }
              histories {
                id
                cardId
                fromStageId
                toStageId
                notes
                createdAt
              }
            }
          }
        }
      }
    `;
    const res = await graphqlClient.request(query, { jobId: String(jobId), companyId: String(companyId) });
    return { data: res.getRecruitmentBoard };
  },

  async createStage(input: { companyId: string | number; jobId?: string | number | null; name: string; color?: string }): Promise<{ data: KanbanStageModel }> {
    const mutation = `
      mutation CreateKanbanStage($input: CreateKanbanStageInput!) {
        createKanbanStage(input: $input) {
          id
          uuid
          name
          color
          orderPosition
          isSystemStage
        }
      }
    `;
    const res = await graphqlClient.request(mutation, { input });
    return { data: res.createKanbanStage };
  },

  async moveCard(input: { cardId: string | number; targetStageId: string | number; targetPosition?: number; notes?: string }): Promise<{ data: KanbanCardModel }> {
    const mutation = `
      mutation MoveKanbanCard($input: MoveKanbanCardInput!) {
        moveKanbanCard(input: $input) {
          id
          stageId
          orderPosition
        }
      }
    `;
    const res = await graphqlClient.request(mutation, { input });
    return { data: res.moveCard };
  },

  async updateCard(id: string | number, input: { rating?: number; notes?: string; tags?: string[] }): Promise<{ data: KanbanCardModel }> {
    const mutation = `
      mutation UpdateKanbanCard($id: ID!, $input: UpdateKanbanCardInput!) {
        updateKanbanCard(id: $id, input: $input) {
          id
          rating
          notes
          tags
        }
      }
    `;
    const res = await graphqlClient.request(mutation, { id: String(id), input });
    return { data: res.updateKanbanCard };
  }
};
