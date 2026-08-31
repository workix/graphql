import companiesRepository from '../../../src/modules/companies/repository/companies.repo';
import selectiveProcessesRepository from '../../../src/modules/selective_processes/repository/selective_processes.repo';
import statsRepository from '../../../src/modules/stats/repository/stats.repo';
import { Company, CompanyMedia, SelectiveProcess, SelectiveProcessCandidate, Job, Resume, Candidate } from '../../../src/models';

jest.mock('../../../src/models', () => ({
  Company: {
    rawAttributes: { id: {}, name: {}, logo: {} },
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    count: jest.fn()
  },
  CompanyMedia: {
    create: jest.fn(),
    destroy: jest.fn()
  },
  SelectiveProcess: {
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    count: jest.fn()
  },
  SelectiveProcessCandidate: {
    create: jest.fn(),
    findOrCreate: jest.fn().mockResolvedValue([{ id: 1 }, true])
  },
  Job: {
    count: jest.fn()
  },
  Candidate: {
    count: jest.fn()
  },
  Resume: {
    count: jest.fn()
  }
}));

describe('Modules - Companies, Selective Processes & Stats Repositories', () => {
  let mockDb: any;
  let mockInfo: any;

  beforeEach(() => {
    mockDb = {
      sequelize: {
        transaction: jest.fn().mockImplementation(async (cb: any) => cb({})),
        query: jest.fn().mockResolvedValue([{ id: 1, name: 'Process 1' }])
      }
    };

    mockInfo = {
      fieldNodes: [
        {
          kind: 'Field',
          name: { value: 'companies' },
          selectionSet: { selections: [{ kind: 'Field', name: { value: 'id' } }] }
        },
        {
          kind: 'Field',
          name: { value: 'selectiveProcesses' },
          selectionSet: { selections: [{ kind: 'Field', name: { value: 'id' } }] }
        }
      ]
    };
  });

  describe('statsRepository', () => {
    it('should calculate statistics counts for members, jobs, resumes, and companies', async () => {
      (Candidate.count as jest.Mock).mockResolvedValue(100);
      (Job.count as jest.Mock).mockResolvedValue(50);
      (Resume.count as jest.Mock).mockResolvedValue(80);
      (Company.count as jest.Mock).mockResolvedValue(20);

      const repo = statsRepository(mockDb);
      const stats = await repo.statisticsCount(mockInfo, {});

      expect(stats).toEqual({
        members: 100,
        jobs: 50,
        resumes: 80,
        companies: 20
      });
    });
  });

  describe('companiesRepository', () => {
    let repo: any;

    beforeEach(() => {
      repo = companiesRepository(mockDb);
    });

    it('should listRandomLogos, findAll, and findById companies', async () => {
      (Company.findAll as jest.Mock).mockResolvedValue([{ id: 1, name: 'TechCorp' }]);
      (Company.findOne as jest.Mock).mockResolvedValue({ id: 1, name: 'TechCorp' });

      expect(await repo.listRandomLogos(mockInfo, { start: 0, max: 5 })).toEqual([{ id: 1, name: 'TechCorp' }]);
      expect(await repo.findAll(mockInfo, { start: 0, max: 10 })).toEqual([{ id: 1, name: 'TechCorp' }]);
      expect(await repo.findById(mockInfo, { id: 1 })).toEqual({ id: 1, name: 'TechCorp' });
    });

    it('should create company with optional medias and handle errors', async () => {
      const mockCompany = { id: 1, reload: jest.fn().mockResolvedValue({}) };
      (Company.create as jest.Mock).mockResolvedValue(mockCompany);

      expect(await repo.create({ input: { name: 'TechCorp', medias: [{ url: 'http://logo.png' }] } })).toBe(mockCompany);

      (Company.create as jest.Mock).mockRejectedValue({ errors: [{ message: 'Duplicate CNPJ' }] });
      await expect(repo.create({ input: {} })).rejects.toThrow('Duplicate CNPJ');

      (Company.create as jest.Mock).mockRejectedValue(new Error('Fatal Error'));
      await expect(repo.create({ input: {} })).rejects.toThrow('Fatal Error');
    });

    it('should destroy company', async () => {
      (Company.destroy as jest.Mock).mockResolvedValue(1);
      expect(await repo.destroy({ id: 1 })).toBe(true);
    });

    it('should update company with medias in transaction or throw if missing', async () => {
      (Company.findByPk as jest.Mock).mockResolvedValue(null);
      await expect(repo.update({ id: 99, input: {} })).rejects.toThrow('Company with id: 99 not found');

      (Company.findByPk as jest.Mock).mockResolvedValue({ id: 1 });
      (Company.update as jest.Mock).mockResolvedValue([[1], []]);
      (Company.findOne as jest.Mock).mockResolvedValue({ id: 1, name: 'Updated TechCorp' });

      const result = await repo.update({ id: 1, input: { name: 'Updated TechCorp', medias: [{ media: 'logo', url: 'http://new.png' }] } });
      expect(result).toEqual({ id: 1, name: 'Updated TechCorp' });
      expect(CompanyMedia.destroy).toHaveBeenCalled();
      expect(CompanyMedia.create).toHaveBeenCalled();
    });

    it('should findAllPaginated companies', async () => {
      (Company.count as jest.Mock).mockResolvedValue(40);
      (Company.findAll as jest.Mock).mockResolvedValue([{ id: 1 }]);
      const paginated = await repo.findAllPaginated(mockInfo, { page: 1, limit: 10 });
      expect(paginated.totalPages).toBe(4);
    });
  });

  describe('selectiveProcessesRepository', () => {
    let repo: any;

    beforeEach(() => {
      repo = selectiveProcessesRepository(mockDb);
    });

    it('should findAll and findById selectiveProcesses', async () => {
      (SelectiveProcess.findAll as jest.Mock).mockResolvedValue([{ id: 1 }]);
      (SelectiveProcess.findOne as jest.Mock).mockResolvedValue({ id: 1 });

      expect(await repo.findAll(mockInfo, { start: 0, max: 10 })).toEqual([{ id: 1 }]);
      expect(await repo.findById(mockInfo, { id: 1 })).toEqual({ id: 1 });
    });

    it('should create and destroy selectiveProcess', async () => {
      const mockSP = { id: 1, reload: jest.fn().mockResolvedValue({}) };
      (SelectiveProcess.create as jest.Mock).mockResolvedValue(mockSP);
      (SelectiveProcess.destroy as jest.Mock).mockResolvedValue(1);

      expect(await repo.create({ input: { title: 'SP 2026' } })).toBe(mockSP);
      expect(await repo.destroy({ id: 1 })).toBe(true);
    });

    it('should update selectiveProcess or throw if missing', async () => {
      (SelectiveProcess.findByPk as jest.Mock).mockResolvedValue(null);
      await expect(repo.update({ id: 99, input: {} })).rejects.toThrow('SelectiveProcess with id: 99 not found');

      (SelectiveProcess.findByPk as jest.Mock).mockResolvedValue({ id: 1 });
      (SelectiveProcess.update as jest.Mock).mockResolvedValue([[1], []]);
      (SelectiveProcess.findOne as jest.Mock).mockResolvedValue({ id: 1, title: 'Updated SP' });

      expect(await repo.update({ id: 1, input: { title: 'Updated SP' } })).toEqual({ id: 1, title: 'Updated SP' });
    });

    it('should subscribe candidate to selectiveProcess', async () => {
      (SelectiveProcessCandidate.create as jest.Mock).mockResolvedValue({});
      expect(await repo.subscribe({ input: { spId: 1, candidateId: 2 } })).toBe(true);
    });

    it('should findMySPSubscribed and findMySPs using ctx user', async () => {
      const ctx = { user: { firebase_uuid: 'fb-uuid-1' } };

      expect(await repo.findMySPSubscribed(mockInfo, {}, ctx)).toEqual([{ id: 1, name: 'Process 1' }]);
      expect(await repo.findMySPs(mockInfo, {}, ctx)).toEqual([{ id: 1, name: 'Process 1' }]);
    });

    it('should findAllPaginated selectiveProcesses', async () => {
      (SelectiveProcess.count as jest.Mock).mockResolvedValue(15);
      (SelectiveProcess.findAll as jest.Mock).mockResolvedValue([{ id: 1 }]);
      const result = await repo.findAllPaginated(mockInfo, { page: 1, limit: 10 });
      expect(result.totalPages).toBe(2);
    });
  });
});
