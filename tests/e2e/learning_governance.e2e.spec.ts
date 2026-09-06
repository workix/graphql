import { getTestApp, setupE2EDatabase, graphqlRequest, request } from './helpers/e2e_setup';
import { MediaAsset } from '../../src/models';

describe('E2E: Cursos, Governança, White-label, Formulários e Mídia (100% de Cobertura)', () => {
  let app: any;
  let tokens: any;
  let candidateUserId: number = 1;
  let companyUserId: number = 2;
  let companyId: number = 1;

  let createdCourseId: string;
  let createdLessonId: string;
  let enrollmentId: string;
  let createdFormId: string;
  let whiteLabelConfigId: string;
  let mediaAssetId: number;

  beforeAll(async () => {
    app = getTestApp();
    tokens = await setupE2EDatabase();
  });

  describe('1. Fluxo de Cursos (LMS), Lições e Matrículas', () => {
    it('deve criar um curso corporativo via createCourse', async () => {
      const mutation = `
        mutation CreateCourse(
          $instructorId: ID!
          $title: String!
          $description: String
          $companyId: ID
          $category: String
          $level: String
          $durationHours: Float
        ) {
          createCourse(
            instructorId: $instructorId
            title: $title
            description: $description
            companyId: $companyId
            category: $category
            level: $level
            durationHours: $durationHours
          ) {
            id
            title
            category
            level
            durationHours
          }
        }
      `;

      const res = await graphqlRequest(app, mutation, {
        instructorId: String(companyUserId),
        title: 'Formação Completa de Engenharia de Software Fullstack',
        description: 'Do backend escalável em TypeScript ao frontend moderno com Vue 3.',
        companyId: String(companyId),
        category: 'Tecnologia',
        level: 'INTERMEDIATE',
        durationHours: 40.0
      }, tokens.companyToken);

      expect(res.status).toBe(200);
      expect(res.body.data).toBeDefined();
      expect(res.body.data.createCourse).toBeDefined();
      expect(res.body.data.createCourse.title).toContain('Formação Completa');
      createdCourseId = res.body.data.createCourse.id;
    });

    it('deve adicionar uma lição ao curso via addCourseLesson', async () => {
      const mutation = `
        mutation AddLesson(
          $courseId: ID!
          $title: String!
          $sectionName: String
          $durationMinutes: Int
          $description: String
        ) {
          addCourseLesson(
            courseId: $courseId
            title: $title
            sectionName: $sectionName
            durationMinutes: $durationMinutes
            description: $description
          ) {
            id
            courseId
            title
            sectionName
            durationMinutes
          }
        }
      `;

      const res = await graphqlRequest(app, mutation, {
        courseId: createdCourseId,
        title: 'Módulo 1: Arquitetura Orientada a Testes (TDD)',
        sectionName: 'Introdução e Fundamentos',
        durationMinutes: 45,
        description: 'Conceitos avançados de automação e pirâmide de testes.'
      }, tokens.companyToken);

      expect(res.status).toBe(200);
      expect(res.body.data).toBeDefined();
      expect(res.body.data.addCourseLesson).toBeDefined();
      expect(res.body.data.addCourseLesson.title).toContain('Módulo 1');
      createdLessonId = res.body.data.addCourseLesson.id;
    });

    it('deve matricular um candidato no curso via enrollInCourse', async () => {
      const mutation = `
        mutation Enroll($courseId: ID!, $userId: ID!) {
          enrollInCourse(courseId: $courseId, userId: $userId) {
            id
            courseId
            userId
          }
        }
      `;

      const res = await graphqlRequest(app, mutation, {
        courseId: createdCourseId,
        userId: String(candidateUserId)
      }, tokens.candidateToken);

      expect(res.status).toBe(200);
      expect(res.body.data).toBeDefined();
      expect(res.body.data.enrollInCourse).toBeDefined();
      enrollmentId = res.body.data.enrollInCourse.id;
    });

    it('deve concluir o curso e gerar certificado via completeCourse', async () => {
      const mutation = `
        mutation Complete($enrollmentId: ID!) {
          completeCourse(enrollmentId: $enrollmentId) {
            id
            enrollmentId
            completedAt
          }
        }
      `;

      const res = await graphqlRequest(app, mutation, {
        enrollmentId: enrollmentId
      }, tokens.candidateToken);

      expect(res.status).toBe(200);
      expect(res.body.data).toBeDefined();
      expect(res.body.data.completeCourse).toBeDefined();
      expect(res.body.data.completeCourse.enrollmentId).toBe(enrollmentId);
    });

    it('deve listar cursos disponíveis via courses e obter detalhes via course', async () => {
      const query = `
        query GetCourses {
          courses {
            id
            title
            category
          }
        }
      `;

      const resList = await graphqlRequest(app, query, {}, tokens.candidateToken);
      expect(resList.status).toBe(200);
      expect(resList.body.data.courses.length).toBeGreaterThan(0);

      const querySingle = `
        query GetCourse($id: ID!) {
          course(id: $id) {
            id
            title
            lessons {
              id
              title
            }
          }
        }
      `;

      const resSingle = await graphqlRequest(app, querySingle, { id: createdCourseId }, tokens.candidateToken);
      expect(resSingle.status).toBe(200);
      expect(resSingle.body.data.course.title).toContain('Formação Completa');
    });
  });

  describe('2. Fluxo de Formulários Dinâmicos', () => {
    it('deve criar um formulário de contato via createForm', async () => {
      const mutation = `
        mutation CreateForm($input: FormInput!) {
          createForm(input: $input) {
            id
            name
            email
            subject
            message
          }
        }
      `;

      const res = await graphqlRequest(app, mutation, {
        input: {
          name: 'Candidato Teste',
          email: 'candidato@workix.com',
          subject: 'Dúvida sobre processo seletivo',
          message: 'Gostaria de obter mais informações sobre as etapas técnicas.'
        }
      }, tokens.candidateToken);

      expect(res.status).toBe(200);
      expect(res.body.data).toBeDefined();
      expect(res.body.data.createForm).toBeDefined();
      expect(res.body.data.createForm.name).toBe('Candidato Teste');
      createdFormId = res.body.data.createForm.id;
    });

    it('deve consultar formulários cadastrados via allForms e getFormById', async () => {
      const queryAll = `
        query AllForms {
          allForms {
            id
            name
            subject
          }
        }
      `;

      const resAll = await graphqlRequest(app, queryAll, {}, tokens.adminToken);
      expect(resAll.status).toBe(200);
      expect(resAll.body.data.allForms.length).toBeGreaterThan(0);

      const queryById = `
        query GetForm($id: ID!) {
          getFormById(id: $id) {
            id
            name
            message
          }
        }
      `;

      const resById = await graphqlRequest(app, queryById, { id: createdFormId }, tokens.adminToken);
      expect(resById.status).toBe(200);
      expect(resById.body.data.getFormById.name).toBe('Candidato Teste');
    });
  });

  describe('3. Governança, LGPD e Feature Flags', () => {
    it('deve exportar dossiê LGPD do usuário via myLgpdDataExport', async () => {
      const query = `
        query LgpdExport($userId: ID!) {
          myLgpdDataExport(userId: $userId) {
            exportDate
            regulation
            user {
              id
              email
            }
          }
        }
      `;

      const res = await graphqlRequest(app, query, {
        userId: String(candidateUserId)
      }, tokens.candidateToken);

      expect(res.status).toBe(200);
      expect(res.body.data).toBeDefined();
      expect(res.body.data.myLgpdDataExport).toBeDefined();
      expect(res.body.data.myLgpdDataExport.regulation).toContain('13.709/2018');
    });

    it('deve listar e atualizar feature flags do tenant via featureFlags e updateTenantFeatureFlag', async () => {
      const listQuery = `
        query GetFlags {
          featureFlags {
            key
            enabled
          }
        }
      `;

      const resList = await graphqlRequest(app, listQuery, {}, tokens.adminToken);
      expect(resList.status).toBe(200);
      expect(resList.body.data.featureFlags.length).toBeGreaterThan(0);

      const updateMutation = `
        mutation UpdateFlag($tenantSlug: String!, $flagKey: String!, $enabled: Boolean!) {
          updateTenantFeatureFlag(tenantSlug: $tenantSlug, flagKey: $flagKey, enabled: $enabled)
        }
      `;

      const resUpdate = await graphqlRequest(app, updateMutation, {
        tenantSlug: 'default',
        flagKey: 'ENABLE_AI_JOB_MATCHING',
        enabled: true
      }, tokens.adminToken);

      expect(resUpdate.status).toBe(200);
      expect(resUpdate.body.data.updateTenantFeatureFlag).toBe(true);
    });
  });

  describe('4. Customização White-label para Empresas', () => {
    it('deve criar ou atualizar configuração White-label via upsertWhiteLabelConfig', async () => {
      const mutation = `
        mutation UpsertWhiteLabel($input: UpsertWhiteLabelConfigInput!) {
          upsertWhiteLabelConfig(input: $input) {
            id
            slug
            name
            primary_color
            secondary_color
            app_title
          }
        }
      `;

      const res = await graphqlRequest(app, mutation, {
        input: {
          slug: 'tech-corp',
          name: 'Tech Corp Talent Hub',
          primary_color: '#4F46E5',
          secondary_color: '#06B6D4',
          accent_color: '#F59E0B',
          background_color: '#0F172A',
          text_color: '#F8FAFC',
          font_family: 'Inter',
          app_title: 'Tech Corp Careers',
          meta_description: 'Plataforma de Carreiras e Recrutamento Tech Corp',
          is_active: true
        }
      }, tokens.companyToken);

      expect(res.status).toBe(200);
      expect(res.body.data).toBeDefined();
      expect(res.body.data.upsertWhiteLabelConfig).toBeDefined();
      expect(res.body.data.upsertWhiteLabelConfig.slug).toBe('tech-corp');
      whiteLabelConfigId = res.body.data.upsertWhiteLabelConfig.id;
    });

    it('deve buscar configurações de White-label via whiteLabelConfig e allWhiteLabelConfigs', async () => {
      const querySingle = `
        query GetWL($slug: String!) {
          whiteLabelConfig(slug: $slug) {
            slug
            name
            primary_color
          }
        }
      `;

      const resSingle = await graphqlRequest(app, querySingle, { slug: 'tech-corp' }, tokens.companyToken);
      expect(resSingle.status).toBe(200);
      expect(resSingle.body.data.whiteLabelConfig.name).toBe('Tech Corp Talent Hub');

      const queryAll = `
        query AllWL {
          allWhiteLabelConfigs {
            id
            slug
            name
          }
        }
      `;

      const resAll = await graphqlRequest(app, queryAll, {}, tokens.companyToken);
      expect(resAll.status).toBe(200);
      expect(resAll.body.data.allWhiteLabelConfigs.length).toBeGreaterThan(0);
    });
  });

  describe('5. Upload de Mídia REST API', () => {
    it('deve aceitar upload de arquivo seguro no endpoint REST /api/upload/:id', async () => {
      // Cria registro de MediaAsset
      const mediaAsset = await MediaAsset.create({
        file_name: 'test-resume.pdf',
        file_type: 'application/pdf',
        context: 'RESUME',
        user_id: candidateUserId,
        status: 'PENDING'
      });
      mediaAssetId = mediaAsset.id;

      // PDF simulado válido com header %PDF-
      const fakePdfBuffer = Buffer.from('%PDF-1.4\n%âãÏÓ\n1 0 obj\n<<\n/Type /Catalog\n>>\nendobj\ntrailer\n<<\n>>\n%%EOF\n');

      const res = await request(app)
        .post(`/api/v1/media/upload/${mediaAssetId}`)
        .set('Authorization', `Bearer ${tokens.candidateToken}`)
        .set('Content-Type', 'application/octet-stream')
        .send(fakePdfBuffer);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty('url');
      expect(res.body.mediaAsset.status).toBe('READY');
    });
  });
});
