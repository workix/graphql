import candidatesRepository from '../../../src/modules/candidates/repository/candidates.repo';
import notificationService from '../../../src/modules/candidates/services/notification.service';
import resumesRepository from '../../../src/modules/resumes/repository/resumes.repo';
import jobsRepository from '../../../src/modules/jobs/repository/jobs.repo';
import { Candidate, Resume, ResumeEducation, ResumeExperience, ResumeSkill, Job, JobCandidate } from '../../../src/models';

jest.mock('../../../src/models', () => ({
  Candidate: {
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    count: jest.fn()
  },
  Resume: {
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    count: jest.fn()
  },
  ResumeEducation: {
    create: jest.fn(),
    destroy: jest.fn()
  },
  ResumeExperience: {
    create: jest.fn(),
    destroy: jest.fn()
  },
  ResumeSkill: {
    create: jest.fn(),
    destroy: jest.fn()
  },
  Job: {
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    count: jest.fn()
  },
  JobCandidate: {
    create: jest.fn(),
    findOrCreate: jest.fn().mockResolvedValue([{ id: 1 }, true])
  }
}));

describe('Modules - Candidates, Resumes & Jobs Repositories', () => {
  let mockDb: any;
  let mockInfo: any;

  beforeEach(() => {
    mockDb = {
      sequelize: {
        transaction: jest.fn().mockImplementation(async (cb: any) => cb({})),
        query: jest.fn().mockResolvedValue([{ id: 1, title: 'Developer' }])
      }
    };

    mockInfo = {
      fieldNodes: [
        {
          kind: 'Field',
          name: { value: 'candidates' },
          selectionSet: {
            selections: [
              { kind: 'Field', name: { value: 'id' } },
              {
                kind: 'Field',
                name: { value: 'locale' },
                selectionSet: { selections: [{ kind: 'Field', name: { value: 'city' } }] }
              },
              {
                kind: 'Field',
                name: { value: 'contact' },
                selectionSet: { selections: [{ kind: 'Field', name: { value: 'phone' } }] }
              }
            ]
          }
        },
        {
          kind: 'Field',
          name: { value: 'resumes' },
          selectionSet: { selections: [{ kind: 'Field', name: { value: 'id' } }] }
        },
        {
          kind: 'Field',
          name: { value: 'jobs' },
          selectionSet: { selections: [{ kind: 'Field', name: { value: 'id' } }] }
        }
      ]
    };
  });

  describe('notificationService', () => {
    it('should throw NOT IMPLEMENTED YET error', async () => {
      await expect(notificationService(mockDb)).rejects.toThrow('NOT IMPLEMENTED YET');
    });
  });

  describe('candidatesRepository', () => {
    let repo: any;

    beforeEach(() => {
      repo = candidatesRepository(mockDb);
    });

    it('should findAll candidates with start/max options', async () => {
      (Candidate.findAll as jest.Mock).mockResolvedValue([{ id: 1, name: 'John' }]);
      const result = await repo.findAll(mockInfo, { start: 0, max: 5 });
      expect(Candidate.findAll).toHaveBeenCalledWith(expect.objectContaining({ offset: 0, limit: 5 }));
      expect(result).toEqual([{ id: 1, name: 'John' }]);
    });

    it('should findById and findByUserId candidate', async () => {
      (Candidate.findOne as jest.Mock).mockResolvedValue({ id: 10, user_id: 1 });
      expect(await repo.findById(mockInfo, { id: 10 })).toEqual({ id: 10, user_id: 1 });
      expect(await repo.findByUserId(mockInfo, { userId: 1 })).toEqual({ id: 10, user_id: 1 });
    });

    it('should create candidate and handle errors', async () => {
      const mockCandidate = { id: 1, reload: jest.fn().mockResolvedValue({}) };
      (Candidate.create as jest.Mock).mockResolvedValue(mockCandidate);
      expect(await repo.create({ input: { name: 'John' } })).toBe(mockCandidate);

      (Candidate.create as jest.Mock).mockRejectedValue({ errors: [{ message: 'Validation error' }] });
      await expect(repo.create({ input: {} })).rejects.toThrow('Validation error');

      (Candidate.create as jest.Mock).mockRejectedValue(new Error('Generic Error'));
      await expect(repo.create({ input: {} })).rejects.toThrow('Generic Error');
    });

    it('should destroy candidate', async () => {
      (Candidate.destroy as jest.Mock).mockResolvedValue(1);
      expect(await repo.destroy({ id: 1 })).toBe(true);
    });

    it('should update candidate or throw if missing', async () => {
      (Candidate.findByPk as jest.Mock).mockResolvedValue(null);
      await expect(repo.update({ id: 99, input: {} })).rejects.toThrow('Candidate with id: 99 not found');

      (Candidate.findByPk as jest.Mock).mockResolvedValue({ id: 1 });
      (Candidate.update as jest.Mock).mockResolvedValue([[1], []]);
      (Candidate.findOne as jest.Mock).mockResolvedValue({ id: 1, name: 'Updated' });

      expect(await repo.update({ id: 1, input: { name: 'Updated' } })).toEqual({ id: 1, name: 'Updated' });
    });

    it('should findAllPaginated candidates', async () => {
      (Candidate.count as jest.Mock).mockResolvedValue(20);
      (Candidate.findAll as jest.Mock).mockResolvedValue([{ id: 1 }]);
      const paginated = await repo.findAllPaginated(mockInfo, { page: 1, limit: 10 });
      expect(paginated.totalPages).toBe(2);
    });
  });

  describe('resumesRepository', () => {
    let repo: any;

    beforeEach(() => {
      repo = resumesRepository(mockDb);
    });

    it('should findAll and findById resumes', async () => {
      (Resume.findAll as jest.Mock).mockResolvedValue([{ id: 1 }]);
      (Resume.findOne as jest.Mock).mockResolvedValue({ id: 1 });

      expect(await repo.findAll(mockInfo, { start: 0, max: 10 })).toEqual([{ id: 1 }]);
      expect(await repo.findById(mockInfo, { id: 1 })).toEqual({ id: 1 });
    });

    it('should create resume with nested educations, experiences, and skills includes', async () => {
      const mockResume = { id: 1, reload: jest.fn().mockResolvedValue({}) };
      (Resume.create as jest.Mock).mockResolvedValue(mockResume);

      const input = {
        candidateId: 1,
        educations: [{ schoolName: 'MIT' }],
        experiences: [{ employerName: 'Google' }],
        skills: [{ skillName: 'TypeScript' }]
      };

      const result = await repo.create({ input });
      expect(result).toBe(mockResume);
      expect(Resume.create).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          include: expect.arrayContaining([
            { model: ResumeExperience, as: 'experiences' },
            { model: ResumeEducation, as: 'educations' },
            { model: ResumeSkill, as: 'skills' }
          ])
        })
      );
    });

    it('should destroy resume', async () => {
      (Resume.destroy as jest.Mock).mockResolvedValue(1);
      expect(await repo.destroy({ id: 1 })).toBe(true);
    });

    it('should update resume with nested educations, experiences, and skills', async () => {
      (Resume.findByPk as jest.Mock).mockResolvedValue(null);
      await expect(repo.update({ id: 99, input: {} })).rejects.toThrow('Resume with id: 99 not found');

      (Resume.findByPk as jest.Mock).mockResolvedValue({ id: 1 });
      (Resume.update as jest.Mock).mockResolvedValue([[1], []]);
      (Resume.findOne as jest.Mock).mockResolvedValue({ id: 1 });

      const input = {
        educations: [{ schoolName: 'Harvard' }],
        experiences: [{ employerName: 'Microsoft' }],
        skills: [{ skillName: 'Node.js' }]
      };

      const updated = await repo.update({ id: 1, input });
      expect(updated).toEqual({ id: 1 });
      expect(ResumeEducation.destroy).toHaveBeenCalled();
      expect(ResumeEducation.create).toHaveBeenCalled();
      expect(ResumeExperience.destroy).toHaveBeenCalled();
      expect(ResumeExperience.create).toHaveBeenCalled();
      expect(ResumeSkill.destroy).toHaveBeenCalled();
      expect(ResumeSkill.create).toHaveBeenCalled();
    });

    it('should findAllPaginated resumes', async () => {
      (Resume.count as jest.Mock).mockResolvedValue(30);
      (Resume.findAll as jest.Mock).mockResolvedValue([{ id: 1 }]);
      const paginated = await repo.findAllPaginated(mockInfo, { page: 1, limit: 10 });
      expect(paginated.totalPages).toBe(3);
    });
  });

  describe('jobsRepository', () => {
    let repo: any;

    beforeEach(() => {
      repo = jobsRepository(mockDb);
    });

    it('should findAll, findAllByCompany, listRandomFeatured, and findAllFeatured jobs', async () => {
      (Job.findAll as jest.Mock).mockResolvedValue([{ id: 1, title: 'Dev' }]);

      expect(await repo.findAll(mockInfo, { start: 0, max: 10 })).toEqual([{ id: 1, title: 'Dev' }]);
      expect(await repo.findAllByCompany(mockInfo, { companyId: 5 })).toEqual([{ id: 1, title: 'Dev' }]);
      expect(await repo.listRandomFeatured(mockInfo, {})).toEqual([{ id: 1, title: 'Dev' }]);
      expect(await repo.findAllFeatured(mockInfo, { featured: true, start: 0, max: 5 })).toEqual([{ id: 1, title: 'Dev' }]);
    });

    it('should findById and findByIdAndCompanyId job', async () => {
      (Job.findOne as jest.Mock).mockResolvedValue({ id: 1, company_id: 5 });
      expect(await repo.findById(mockInfo, { id: 1 })).toEqual({ id: 1, company_id: 5 });
      expect(await repo.findByIdAndCompanyId(mockInfo, { id: 1, companyId: 5 })).toEqual({ id: 1, company_id: 5 });
    });

    it('should create and destroy job', async () => {
      const mockJob = { id: 1, reload: jest.fn().mockResolvedValue({}) };
      (Job.create as jest.Mock).mockResolvedValue(mockJob);
      (Job.destroy as jest.Mock).mockResolvedValue(1);

      expect(await repo.create({ input: { title: 'Backend' } })).toBe(mockJob);
      expect(await repo.destroy({ id: 1 })).toBe(true);
    });

    it('should update job or throw if missing', async () => {
      (Job.findByPk as jest.Mock).mockResolvedValue(null);
      await expect(repo.update({ id: 99, input: {} })).rejects.toThrow('Job with id: 99 not found');

      (Job.findByPk as jest.Mock).mockResolvedValue({ id: 1 });
      (Job.update as jest.Mock).mockResolvedValue([[1], []]);
      (Job.findOne as jest.Mock).mockResolvedValue({ id: 1, title: 'Senior Dev' });

      expect(await repo.update({ id: 1, input: { title: 'Senior Dev' } })).toEqual({ id: 1, title: 'Senior Dev' });
    });

    it('should subscribe candidate to job', async () => {
      (JobCandidate.create as jest.Mock).mockResolvedValue({});
      expect(await repo.subscribe({ input: { jobId: 1, candidateId: 2 } })).toBe(true);
      expect(JobCandidate.create).toHaveBeenCalledWith({ job_id: 1, candidate_id: 2 });
    });

    it('should findMyJobs using ctx user', async () => {
      const ctx = { user: { firebase_uuid: 'fb-user-123' } };
      const jobs = await repo.findMyJobs(mockInfo, {}, ctx);
      expect(mockDb.sequelize.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT DISTINCT j.* FROM jobs j'),
        expect.objectContaining({ replacements: { firebase_uuid: 'fb-user-123' } })
      );
      expect(jobs).toEqual([{ id: 1, title: 'Developer' }]);
    });

    it('should findAllPaginated jobs', async () => {
      (Job.count as jest.Mock).mockResolvedValue(50);
      (Job.findAll as jest.Mock).mockResolvedValue([{ id: 1 }]);
      const paginated = await repo.findAllPaginated(mockInfo, { page: 1, limit: 10 });
      expect(paginated.totalPages).toBe(5);
    });
  });
});
