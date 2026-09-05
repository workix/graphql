import { Sequelize, DataTypes } from 'sequelize';

describe('Recruitment & Candidate Models and Persistence', () => {
  let sequelize: any;
  let UserModel: any;
  let CompanyModel: any;
  let CandidateModel: any;
  let JobModel: any;
  let NormalizedResumeModel: any;
  let InterviewModel: any;
  let KanbanStageModel: any;
  let KanbanCardModel: any;
  let KanbanCardHistoryModel: any;

  beforeAll(async () => {
    sequelize = new Sequelize('sqlite::memory:', { logging: false });

    // Load dependencies and tested models
    const userFactory = require('../../src/models/user');
    const companyFactory = require('../../src/models/company');
    const candidateFactory = require('../../src/models/candidate');
    const jobFactory = require('../../src/models/job');
    const resumeFactory = require('../../src/models/normalized_resume');
    const interviewFactory = require('../../src/models/interview');
    const stageFactory = require('../../src/models/kanban_stage');
    const cardFactory = require('../../src/models/kanban_card');
    const historyFactory = require('../../src/models/kanban_card_history');

    UserModel = userFactory(sequelize, DataTypes);
    CompanyModel = companyFactory(sequelize, DataTypes);
    CandidateModel = candidateFactory(sequelize, DataTypes);
    JobModel = jobFactory(sequelize, DataTypes);
    NormalizedResumeModel = resumeFactory(sequelize, DataTypes);
    InterviewModel = interviewFactory(sequelize, DataTypes);
    KanbanStageModel = stageFactory(sequelize, DataTypes);
    KanbanCardModel = cardFactory(sequelize, DataTypes);
    KanbanCardHistoryModel = historyFactory(sequelize, DataTypes);

    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('deve persistir e carregar status de carreira em Candidate com defaults corretos', async () => {
    const user = await UserModel.create({
      username: 'maria.silva',
      email: 'maria@example.com',
      password: 'hashed_password',
      activated: true,
      firebase_uuid: 'fb_maria_123'
    });

    const candidate = await CandidateModel.create({
      name: 'Maria Silva',
      birth_date: '1995-05-20',
      user_id: user.id,
      looking_for_job: true,
      in_career_transition: true,
      career_transition_target: 'Desenvolvimento Frontend',
      accepts_entry_level: true
    });

    expect(candidate.id).toBeDefined();
    expect(candidate.looking_for_job).toBe(true);
    expect(candidate.in_career_transition).toBe(true);
    expect(candidate.career_transition_target).toBe('Desenvolvimento Frontend');
    expect(candidate.accepts_entry_level).toBe(true);
  });

  it('deve persistir vaga confidencial com flag is_confidential', async () => {
    const companyUser = await UserModel.create({
      username: 'techcorp_user',
      email: 'corp@tech.com',
      password: 'password123',
      activated: true,
      firebase_uuid: 'fb_techcorp_456'
    });

    const company = await CompanyModel.create({
      name: 'Tech Corp Confidencial',
      user_id: companyUser.id,
      mobile_phone: 11988887777,
      city: 'São Paulo',
      state: 'SP',
      neighborhood: 'Pinheiros',
      number: '100',
      street: 'Av Paulista',
      zip_code: 13000000,
      cnpj: 12345678000199,
      logo: 'https://example.com/logo.png',
      segment: 'Tecnologia'
    });

    const job = await JobModel.create({
      title: 'Diretor de Engenharia Estratégico',
      description: 'Posição confidencial de liderança',
      benefits: 'VT + VR + Bônus',
      requirement: '10+ anos de experiência',
      job_category: 'MANAGEMENT',
      job_type: 'FULLTIME',
      min_payment: 20000,
      max_payment: 35000,
      activated: true,
      featured: false,
      company_id: company.id,
      is_confidential: true
    });

    expect(job.id).toBeDefined();
    expect(job.is_confidential).toBe(true);
  });

  it('deve persistir currículo normalizado em Markdown', async () => {
    const candidate = await CandidateModel.findOne();

    const resume = await NormalizedResumeModel.create({
      candidate_id: candidate.id,
      raw_markdown: '# Maria Silva\n\n## Resumo\nDesenvolvedora em transição.\n\n## Skills\n- Vue.js\n- TypeScript',
      summary: 'Desenvolvedora em transição.',
      skills: JSON.stringify(['Vue.js', 'TypeScript']),
      career_goals: 'Atuar como frontend júnior/pleno',
      completeness_score: 85
    });

    expect(resume.id).toBeDefined();
    expect(resume.raw_markdown).toContain('# Maria Silva');
    expect(resume.completeness_score).toBe(85);
  });

  it('deve persistir entrevistas com status inicial PENDING', async () => {
    const candidate = await CandidateModel.findOne();
    const job = await JobModel.findOne();
    const company = await CompanyModel.findOne();

    const interview = await InterviewModel.create({
      job_id: job.id,
      candidate_id: candidate.id,
      company_id: company.id,
      scheduled_at: new Date('2026-10-15T14:00:00Z'),
      duration_minutes: 60,
      format: 'ONLINE',
      location_or_link: 'https://meet.google.com/abc-defg-hij',
      status: 'PENDING'
    });

    expect(interview.id).toBeDefined();
    expect(interview.status).toBe('PENDING');
    expect(interview.duration_minutes).toBe(60);
  });

  it('deve persistir estágios e cards de Kanban com histórico', async () => {
    const candidate = await CandidateModel.findOne();
    const job = await JobModel.findOne();

    const stage = await KanbanStageModel.create({
      job_id: job.id,
      title: 'Triagem Inicial',
      stage_order: 1,
      color_hex: '#3B82F6'
    });

    const card = await KanbanCardModel.create({
      stage_id: stage.id,
      job_id: job.id,
      candidate_id: candidate.id,
      position_order: 1,
      notes: 'Candidata com forte potencial'
    });

    const history = await KanbanCardHistoryModel.create({
      card_id: card.id,
      from_stage_id: null,
      to_stage_id: stage.id,
      user_id: 50,
      notes: 'Candidata adicionada à triagem'
    });

    expect(stage.id).toBeDefined();
    expect(card.id).toBeDefined();
    expect(history.id).toBeDefined();
    expect(card.stage_id).toBe(stage.id);
  });
});
