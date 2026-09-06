import { getTestApp, setupE2EDatabase, graphqlRequest, request } from './helpers/e2e_setup';

describe('E2E: Autenticação, Usuários e JAAS (100% de Cobertura)', () => {
  let app: any;
  let tokens: any;

  beforeAll(async () => {
    app = getTestApp();
    tokens = await setupE2EDatabase();
  });

  it('deve retornar status 200 na rota de health check do backend', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status');
  });

  it('deve realizar login via mutation doLogin e obter token JWT', async () => {
    const mutation = `
      mutation DoLogin($input: LoginInput!) {
        doLogin(input: $input)
      }
    `;

    const res = await graphqlRequest(app, mutation, {
      input: {
        email: tokens.candidateUser.email,
        firebaseUUID: tokens.candidateUser.firebase_uuid
      }
    });

    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.doLogin).toBeDefined();
    expect(typeof res.body.data.doLogin).toBe('string');
  });

  it('deve consultar perfil completo do usuário autenticado via aboutMe com token de candidato', async () => {
    const query = `
      query {
        aboutMe {
          user {
            id
            email
            firebaseUUID
            activated
          }
          candidate {
            id
            name
            cpf
          }
        }
      }
    `;

    const res = await graphqlRequest(app, query, {}, tokens.candidateToken);
    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.aboutMe).toBeDefined();
    expect(res.body.data.aboutMe.user.email).toBe(tokens.candidateUser.email);
    expect(res.body.data.aboutMe.candidate).toBeDefined();
    expect(res.body.data.aboutMe.candidate.name).toBe('Carlos E2E Teste');
  });

  it('deve consultar perfil completo da empresa autenticada via aboutMe com token de empresa', async () => {
    const query = `
      query {
        aboutMe {
          user {
            id
            email
            firebaseUUID
          }
          company {
            id
            name
            cnpj
          }
        }
      }
    `;

    const res = await graphqlRequest(app, query, {}, tokens.companyToken);
    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.aboutMe.user.email).toBe(tokens.companyUser.email);
    expect(res.body.data.aboutMe.company).toBeDefined();
    expect(res.body.data.aboutMe.company.name).toBe('Tech E2E Corp');
  });

  it('deve bloquear acesso à query aboutMe quando nenhum token for informado', async () => {
    const query = `
      query {
        aboutMe {
          user {
            id
            email
          }
        }
      }
    `;

    const res = await graphqlRequest(app, query);
    expect(res.status).toBe(200);
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors.length).toBeGreaterThan(0);
  });

  it('deve listar papéis JAAS disponíveis no sistema', async () => {
    const query = `
      query {
        allJAASRoles {
          name
        }
      }
    `;

    const res = await graphqlRequest(app, query, {}, tokens.adminToken);
    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
    expect(Array.isArray(res.body.data.allJAASRoles)).toBe(true);
    expect(res.body.data.allJAASRoles.some((r: any) => r.name === 'ROLE_ADMIN')).toBe(true);
  });

  it('deve consultar lista de usuários no sistema via allUsers', async () => {
    const query = `
      query {
        allUsers(start: 0, max: 10) {
          id
          email
          activated
        }
      }
    `;

    const res = await graphqlRequest(app, query, {}, tokens.adminToken);
    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
    expect(Array.isArray(res.body.data.allUsers)).toBe(true);
    expect(res.body.data.allUsers.length).toBeGreaterThan(0);
  });
});
