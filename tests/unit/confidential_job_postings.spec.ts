import JobDTO from '../../src/dtos/JobDTO';
import { CreateJobDTO, UpdateJobDTO } from '../../src/dtos/JobMutationDTO';
import jobsResolvers from '../../src/modules/jobs/graphql/jobs.resolvers';
import { entitlementsService } from '../../src/modules/premium/services/entitlements.service';

jest.mock('../../src/modules/premium/services/entitlements.service', () => ({
  entitlementsService: {
    can: jest.fn(),
  }
}));

describe('Confidential Job Postings (Vagas Confidenciais)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('JobDTO e Mutation DTOs', () => {
    it('deve mapear isConfidential corretamente no JobDTO', () => {
      const rawConfidentialJob = {
        id: 10,
        title: 'Tech Lead',
        is_confidential: true,
        categories: ['MANAGEMENT'],
        employment_type: 'CLT',
        company_id: 5,
      };

      const dto = new JobDTO(rawConfidentialJob);
      expect(dto.isConfidential).toBe(true);
      expect(dto.title).toBe('Tech Lead');
    });

    it('deve preencher is_confidential em CreateJobDTO e UpdateJobDTO', () => {
      const createInput = {
        title: 'Arquiteto de Software',
        isConfidential: true,
        companyId: 2,
        maxPayment: 20000,
        minPayment: 15000,
        requirement: 'Senior',
        description: 'Vaga confidencial',
        benefits: 'Todos',
        activated: true,
        featured: false,
      };

      const createDto = new CreateJobDTO(createInput);
      expect(createDto.is_confidential).toBe(true);

      const updateDto = new UpdateJobDTO({ isConfidential: false });
      expect(updateDto.is_confidential).toBe(false);
    });
  });

  describe('Mascaramento e Resolução de Empresa', () => {
    it('deve retornar Empresa Confidencial mascarada para candidatos e usuários não-proprietários', async () => {
      const jobParent = {
        id: 1,
        companyId: 99,
        isConfidential: true,
      };

      const candidateCtx = {
        user: { id: 10, role: 'CANDIDATE', companyId: null },
        dataloaders: {
          companiesLoader: {
            load: jest.fn().mockResolvedValue([{ id: 99, name: 'Empresa Secreta S.A.' }]),
          }
        }
      };

      const companyResult = await jobsResolvers.Job.company(jobParent, {}, candidateCtx, {});

      expect(companyResult.name).toBe('Empresa Confidencial');
      expect(companyResult.id).toBeNull();
      expect(companyResult.logo).toBeNull();
      expect(companyResult.isConfidential).toBe(true);
      expect(candidateCtx.dataloaders.companiesLoader.load).not.toHaveBeenCalled();
    });

    it('deve retornar a empresa real para o recrutador proprietário ou administrador', async () => {
      const jobParent = {
        id: 1,
        companyId: 99,
        isConfidential: true,
      };

      const ownerCtx = {
        user: { id: 20, role: 'RECRUITER', companyId: 99 },
        dataloaders: {
          companiesLoader: {
            load: jest.fn().mockResolvedValue([{
              id: 99,
              name: 'Empresa Real S.A.',
              business_name: 'Empresa Real',
            }]),
          }
        }
      };

      const companyResult = await jobsResolvers.Job.company(jobParent, {}, ownerCtx, {});

      expect(companyResult.name).toBe('Empresa Real S.A.');
      expect(companyResult.id).toBe(99);
      expect(ownerCtx.dataloaders.companiesLoader.load).toHaveBeenCalledWith({ key: 99, info: {} });
    });
  });

  describe('Validação de Plano Premium na Criação de Vagas Confidenciais', () => {
    it('deve bloquear a criação de vaga confidencial se a empresa não tiver plano Premium', async () => {
      (entitlementsService.can as jest.Mock).mockResolvedValue({
        allow: false,
        reason: 'A publicação de vagas confidenciais é exclusiva para planos Premium.',
      });

      const args = {
        input: {
          title: 'Diretor de Engenharia',
          isConfidential: true,
          companyId: 5,
        }
      };

      const ctx = {
        orm: {},
        rabbitmqClient: {},
      };

      await expect(jobsResolvers.Mutation.createJob(null, args, ctx, null))
        .rejects.toThrow('A publicação de vagas confidenciais é exclusiva para planos Premium.');

      expect(entitlementsService.can).toHaveBeenCalledWith(5, 'POST_CONFIDENTIAL_JOBS');
    });
  });
});
