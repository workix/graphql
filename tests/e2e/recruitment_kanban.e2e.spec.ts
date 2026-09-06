import { getTestApp, setupE2EDatabase, graphqlRequest } from './helpers/e2e_setup';
import db from '../../src/models/index';

describe('E2E: Kanban de Recrutamento, Processos Seletivos e Entrevistas (100% de Cobertura)', () => {
  let app: any;
  let tokens: any;
  let companyId: number;
  let candidateId: number;
  let jobId: number;
  let cardId: string;
  let stage1Id: string;
  let stage2Id: string;

  beforeAll(async () => {
    app = getTestApp();
    tokens = await setupE2EDatabase();

    const company = await db.Company.findOne({ where: { user_id: tokens.companyUser.id } });
    companyId = company.id;

    const candidate = await db.Candidate.findOne({ where: { user_id: tokens.candidateUser.id } });
    candidateId = candidate.id;

    const [job] = await db.Job.findOrCreate({
      where: { title: 'Vaga para Teste Kanban E2E' },
      defaults: {
        title: 'Vaga para Teste Kanban E2E',
        description: 'Vaga dedicada ao teste de fluxo do Kanban e Entrevistas.',
        requirement: 'Conhecimento em processos ágeis e testes.',
        benefits: 'Benefícios padrão.',
        job_category: 'MANAGEMENT',
        job_type: 'FULLTIME',
        min_payment: 9000,
        max_payment: 13000,
        activated: true,
        featured: false,
        company_id: companyId
      }
    });
    jobId = job.id;
  });

  it('deve carregar o quadro Kanban com as fases padrão para o processo seletivo', async () => {
    const query = `
      query GetBoard($jobId: ID!, $companyId: ID!) {
        getRecruitmentBoard(jobId: $jobId, companyId: $companyId) {
          jobId
          companyId
          stages {
            id
            name
            color
            orderPosition
            cards {
              id
            }
          }
        }
      }
    `;

    const res = await graphqlRequest(app, query, {
      jobId: String(jobId),
      companyId: String(companyId)
    }, tokens.companyToken);

    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.getRecruitmentBoard).toBeDefined();
    expect(res.body.data.getRecruitmentBoard.stages.length).toBeGreaterThanOrEqual(2);

    stage1Id = res.body.data.getRecruitmentBoard.stages[0].id;
    stage2Id = res.body.data.getRecruitmentBoard.stages[1].id;
  });

  it('deve adicionar um candidato ao quadro Kanban via addCandidateToBoard', async () => {
    const mutation = `
      mutation AddCandidate($input: AddCandidateToBoardInput!) {
        addCandidateToBoard(input: $input) {
          id
          stageId
          candidateId
          jobId
          orderPosition
        }
      }
    `;

    const res = await graphqlRequest(app, mutation, {
      input: {
        companyId: String(companyId),
        jobId: String(jobId),
        candidateId: String(candidateId),
        stageId: stage1Id
      }
    }, tokens.companyToken);

    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.addCandidateToBoard).toBeDefined();
    expect(res.body.data.addCandidateToBoard.candidateId).toBe(String(candidateId));
    cardId = res.body.data.addCandidateToBoard.id;
  });

  it('deve mover o card do candidato para a fase seguinte com anotações via moveKanbanCard', async () => {
    const mutation = `
      mutation MoveCard($input: MoveKanbanCardInput!) {
        moveKanbanCard(input: $input) {
          id
          stageId
          notes
          histories {
            id
            toStageId
            notes
          }
        }
      }
    `;

    const res = await graphqlRequest(app, mutation, {
      input: {
        cardId: cardId,
        targetStageId: stage2Id,
        notes: 'Candidato aprovado na triagem técnica e avançado para entrevista'
      }
    }, tokens.companyToken);

    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.moveKanbanCard).toBeDefined();
    expect(res.body.data.moveKanbanCard.stageId).toBe(stage2Id);
    expect(res.body.data.moveKanbanCard.notes).toContain('Candidato aprovado');
  });

  it('deve agendar uma entrevista técnica com o candidato via createInterview', async () => {
    const mutation = `
      mutation CreateInterview($input: CreateInterviewInput!) {
        createInterview(input: $input) {
          id
          title
          status
          format
          meetingLink
          durationMinutes
        }
      }
    `;

    const scheduledDate = new Date(Date.now() + 86400000).toISOString();

    const res = await graphqlRequest(app, mutation, {
      input: {
        companyId: String(companyId),
        candidateId: String(candidateId),
        jobId: String(jobId),
        title: 'Entrevista Técnica E2E - Arquitetura Full Stack',
        description: 'Entrevista de alinhamento técnico e discussão sobre testes E2E.',
        scheduledAt: scheduledDate,
        durationMinutes: 45,
        format: 'ONLINE',
        meetingLink: 'https://meet.workix.com/e2e-interview'
      }
    }, tokens.companyToken);

    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.createInterview).toBeDefined();
    expect(res.body.data.createInterview.title).toBe('Entrevista Técnica E2E - Arquitetura Full Stack');
    expect(res.body.data.createInterview.format).toBe('ONLINE');
  });
});
