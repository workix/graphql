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
        city: 'São Paulo',
        state: 'SP',
        street: 'Av Paulista',
        number: '500',
        zip_code: 1310000,
        user_id: companyUser.id
      }
    });
    companyInstance = comp;
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
