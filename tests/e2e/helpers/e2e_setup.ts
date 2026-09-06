import request from 'supertest';
import jwt from 'jsonwebtoken';
import createApp from '../../../src/app';
import db from '../../../src/models/index';

const JWT_SECRET = process.env.JWT_SECRET || 'SECRET';

export interface TestUserTokens {
  candidateToken: string;
  companyToken: string;
  adminToken: string;
  candidateUser: any;
  companyUser: any;
  adminUser: any;
}

let appInstance: any = null;

export function getTestApp() {
  if (!appInstance) {
    appInstance = createApp({ db });
  }
  return appInstance;
}

export function generateToken(firebaseUuid: string, email: string): string {
  return jwt.sign(
    { id: firebaseUuid, sub: email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export async function setupE2EDatabase(): Promise<TestUserTokens> {
  // Garante que as tabelas estejam sincronizadas
  await db.sequelize.sync({ force: false });

  // Adiciona colunas se nao existirem no sqlite de teste
  try {
    await db.sequelize.query('ALTER TABLE interviews ADD COLUMN title VARCHAR(255);').catch(() => {});
    await db.sequelize.query('ALTER TABLE interviews ADD COLUMN description TEXT;').catch(() => {});
    await db.sequelize.query('ALTER TABLE interviews ADD COLUMN meeting_link VARCHAR(255);').catch(() => {});
    await db.sequelize.query('ALTER TABLE interviews ADD COLUMN location_address VARCHAR(255);').catch(() => {});
    await db.sequelize.query('ALTER TABLE interviews ADD COLUMN feedback_notes TEXT;').catch(() => {});
    await db.sequelize.query('ALTER TABLE interviews ADD COLUMN reschedule_reason TEXT;').catch(() => {});

    await db.sequelize.query('ALTER TABLE kanban_stages ADD COLUMN uuid VARCHAR(36);').catch(() => {});
    await db.sequelize.query('ALTER TABLE kanban_stages ADD COLUMN company_id BIGINT;').catch(() => {});
    await db.sequelize.query('ALTER TABLE kanban_stages ADD COLUMN name VARCHAR(100);').catch(() => {});
    await db.sequelize.query('ALTER TABLE kanban_stages ADD COLUMN color VARCHAR(20);').catch(() => {});
    await db.sequelize.query('ALTER TABLE kanban_stages ADD COLUMN order_position INTEGER;').catch(() => {});
    await db.sequelize.query('ALTER TABLE kanban_stages ADD COLUMN is_system_stage BOOLEAN;').catch(() => {});

    await db.sequelize.query('ALTER TABLE kanban_cards ADD COLUMN uuid VARCHAR(36);').catch(() => {});
    await db.sequelize.query('ALTER TABLE kanban_cards ADD COLUMN order_position INTEGER;').catch(() => {});
    await db.sequelize.query('ALTER TABLE kanban_cards ADD COLUMN rating INTEGER;').catch(() => {});
  } catch (_e) {}

  // 1. Cria ou recupera Usuário Candidato
  const [candidateUser] = await db.User.findOrCreate({
    where: { email: 'e2e.candidate@workix.com' },
    defaults: {
      email: 'e2e.candidate@workix.com',
      activated: true,
      firebase_uuid: 'fb-uuid-e2e-cand',
      verified: true,
      verification_method: 'WORK_EMAIL'
    }
  });

  // 2. Cria ou recupera Usuário Empresa
  const [companyUser] = await db.User.findOrCreate({
    where: { email: 'e2e.company@workix.com' },
    defaults: {
      email: 'e2e.company@workix.com',
      activated: true,
      firebase_uuid: 'fb-uuid-e2e-comp',
      verified: true,
      verification_method: 'GOV_ID'
    }
  });

  // 3. Cria ou recupera Usuário Admin
  const [adminUser] = await db.User.findOrCreate({
    where: { email: 'e2e.admin@workix.com' },
    defaults: {
      email: 'e2e.admin@workix.com',
      activated: true,
      firebase_uuid: 'fb-uuid-e2e-admin',
      verified: true,
      verification_method: 'PHONE'
    }
  });

  // Garante Perfis JAAS
  if (db.JAASRole) {
    for (const r of ['ROLE_USER', 'ROLE_ADMIN', 'ROLE_CANDIDATE', 'ROLE_COMPANY']) {
      await db.JAASRole.findOrCreate({ where: { name: r }, defaults: { name: r } });
    }
  }

  // Candidato e Empresa modelos
  if (db.Candidate) {
    await db.Candidate.findOrCreate({
      where: { user_id: candidateUser.id },
      defaults: {
        name: 'Carlos E2E Teste',
        cpf: 11122233344,
        birth_date: '1995-01-01',
        mobile_phone: 11999990000,
        city: 'São Paulo',
        state: 'SP',
        street: 'Rua dos Testes',
        number: '123',
        zip_code: 1000000,
        user_id: candidateUser.id
      }
    });
  }

  let companyInstance: any = null;
  if (db.Company) {
    const [comp] = await db.Company.findOrCreate({
      where: { user_id: companyUser.id },
      defaults: {
        name: 'Tech E2E Corp',
        cnpj: 11222333000199,
        description: 'Empresa para testes E2E automatizados',
        segment: 'Tecnologia',
        logo: 'https://via.placeholder.com/150',
        mobile_phone: 1133334444,
        city: 'São Paulo',
        state: 'SP',
        neighborhood: 'Bela Vista',
        street: 'Av Paulista',
        number: '500',
        zip_code: 1310000,
        user_id: companyUser.id
      }
    });
    companyInstance = comp;
  }

  // Planos e Features para Entitlements
  if (db.Plan && db.PlanFeature) {
    const [freePlan] = await db.Plan.findOrCreate({
      where: { code: 'free_v1' },
      defaults: {
        id: 1,
        code: 'free_v1',
        name: 'Plano Gratuito Empresa',
        price_cents: 0,
        currency: 'BRL',
        interval: 'month',
        active: true
      }
    });

    const features = [
      { key: 'max_active_jobs', type: 'INTEGER', intVal: 10, boolVal: true },
      { key: 'POST_CONFIDENTIAL_JOBS', type: 'BOOLEAN', intVal: 0, boolVal: true },
      { key: 'RECRUITMENT_KANBAN', type: 'BOOLEAN', intVal: 0, boolVal: true },
      { key: 'USE_RECRUITMENT_KANBAN', type: 'BOOLEAN', intVal: 0, boolVal: true },
      { key: 'recruitment_kanban', type: 'BOOLEAN', intVal: 0, boolVal: true },
      { key: 'SCHEDULE_INTERVIEWS', type: 'BOOLEAN', intVal: 0, boolVal: true },
      { key: 'schedule_interviews', type: 'BOOLEAN', intVal: 0, boolVal: true },
      { key: 'interview_scheduler', type: 'BOOLEAN', intVal: 0, boolVal: true },
      { key: 'AI_RESUME_PARSING', type: 'BOOLEAN', intVal: 0, boolVal: true },
      { key: 'WHITE_LABEL_BRANDING', type: 'BOOLEAN', intVal: 0, boolVal: true },
      { key: 'ADVANCED_ANALYTICS', type: 'BOOLEAN', intVal: 0, boolVal: true },
      { key: 'EXPORT_METRICS', type: 'BOOLEAN', intVal: 0, boolVal: true }
    ];

    for (const feat of features) {
      await db.PlanFeature.findOrCreate({
        where: { plan_id: freePlan.id, feature_key: feat.key },
        defaults: {
          plan_id: freePlan.id,
          feature_key: feat.key,
          enabled: true
        }
      });
    }
  }

  // Gera tokens JWT para os perfis
  const candidateToken = generateToken(candidateUser.firebase_uuid, candidateUser.email);
  const companyToken = generateToken(companyUser.firebase_uuid, companyUser.email);
  const adminToken = generateToken(adminUser.firebase_uuid, adminUser.email);

  return {
    candidateToken,
    companyToken,
    adminToken,
    candidateUser,
    companyUser,
    adminUser
  };
}

export async function graphqlRequest(app: any, query: string, variables: any = {}, token?: string) {
  const req = request(app)
    .post('/graphql')
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json');

  if (token) {
    req.set('Authorization', `Bearer ${token}`);
  }

  return req.send({ query, variables });
}

export { request };
