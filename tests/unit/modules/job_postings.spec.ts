import jobPostingsRepository from '../../../src/modules/job_postings/repository/job_postings.repo';
import jobPostingsResolvers from '../../../src/modules/job_postings/graphql/job_postings.resolvers';
import JobPostingDTO from '../../../src/dtos/JobPostingDTO';
import JobApplicationDTO from '../../../src/dtos/JobApplicationDTO';
import { JobPosting, JobApplication } from '../../../src/models';

jest.mock('../../../src/models', () => ({
  JobPosting: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn()
  },
  JobApplication: {
    create: jest.fn(),
    findAll: jest.fn()
  }
}));

describe('Job Postings Module Unit Tests (TDD)', () => {
  let mockCtx: any;

  beforeEach(() => {
    mockCtx = { orm: {} };
  });

  describe('jobPostingsRepository', () => {
    it('should create job posting with JSON required skills', async () => {
      const mockJob = { id: 1, company_id: 10, title: 'Dev', required_skills: '["TS","Node"]' };
      (JobPosting.create as jest.Mock).mockResolvedValue(mockJob);

      const repo = jobPostingsRepository(mockCtx.orm);
      const res = await repo.createJobPosting(10, 'Dev', 'Desc', 'SP', 'REMOTE', ['TS', 'Node']);

      expect(res).toEqual(mockJob);
    });

    it('should list and find job postings', async () => {
      const mockJob = { id: 1, company_id: 10, title: 'Dev' };
      (JobPosting.findAll as jest.Mock).mockResolvedValue([mockJob]);
      (JobPosting.findByPk as jest.Mock).mockResolvedValue(mockJob);

      const repo = jobPostingsRepository(mockCtx.orm);
      expect(await repo.getJobPostings(10)).toEqual([mockJob]);
      expect(await repo.getJobPostingById(1)).toEqual(mockJob);
    });

    it('should throw error when applying to non-existing job', async () => {
      (JobPosting.findByPk as jest.Mock).mockResolvedValue(null);
      const repo = jobPostingsRepository(mockCtx.orm);

      await expect(repo.applyToJob(99, 10, ['TS'])).rejects.toThrow('Job posting 99 not found');
    });

    it('should calculate 100% match when job has no required skills', async () => {
      const mockJob = { id: 1, required_skills: null };
      const mockApp = { id: 1, job_id: 1, candidate_id: 10, match_score: 100 };

      (JobPosting.findByPk as jest.Mock).mockResolvedValue(mockJob);
      (JobApplication.create as jest.Mock).mockResolvedValue(mockApp);

      const repo = jobPostingsRepository(mockCtx.orm);
      const app = await repo.applyToJob(1, 10, []);

      expect(JobApplication.create).toHaveBeenCalledWith(expect.objectContaining({ match_score: 100 }));
      expect(app).toEqual(mockApp);
    });

    it('should calculate accurate match score (e.g. 2 out of 3 = 66.67%)', async () => {
      const mockJob = { id: 1, required_skills: '["TypeScript", "GraphQL", "Docker"]' };
      (JobPosting.findByPk as jest.Mock).mockResolvedValue(mockJob);
      (JobApplication.create as jest.Mock).mockResolvedValue({ id: 2 });

      const repo = jobPostingsRepository(mockCtx.orm);
      await repo.applyToJob(1, 10, ['TypeScript', 'GraphQL', 'Python']);

      expect(JobApplication.create).toHaveBeenCalledWith(expect.objectContaining({ match_score: 66.67 }));
    });

    it('should list job applications', async () => {
      const mockApps = [{ id: 1, job_id: 1, candidate_id: 10, match_score: 100 }];
      (JobApplication.findAll as jest.Mock).mockResolvedValue(mockApps);

      const repo = jobPostingsRepository(mockCtx.orm);
      const res = await repo.getJobApplications(1);

      expect(res).toEqual(mockApps);
    });
  });

  describe('jobPostingsResolvers', () => {
    it('should resolve queries and mutations for job postings', async () => {
      const mockJob = { id: 1, company_id: 10, title: 'Dev', required_skills: null };
      const mockApp = { id: 1, job_id: 1, candidate_id: 10, match_score: 100 };

      (JobPosting.findAll as jest.Mock).mockResolvedValue([mockJob]);
      (JobPosting.findByPk as jest.Mock).mockResolvedValue(mockJob);
      (JobApplication.findAll as jest.Mock).mockResolvedValue([mockApp]);
      (JobPosting.create as jest.Mock).mockResolvedValue(mockJob);
      (JobApplication.create as jest.Mock).mockResolvedValue(mockApp);

      const q = jobPostingsResolvers.Query;
      const m = jobPostingsResolvers.Mutation;

      const jobs = await q.jobPostings(null, { companyId: 10 }, mockCtx, {});
      expect(jobs[0]).toBeInstanceOf(JobPostingDTO);

      const jobDto = await q.jobPosting(null, { id: 1 }, mockCtx, {});
      expect(jobDto).toBeInstanceOf(JobPostingDTO);

      const apps = await q.jobApplications(null, { jobId: 1 }, mockCtx, {});
      expect(apps[0]).toBeInstanceOf(JobApplicationDTO);

      const createdJob = await m.createJobPosting(null, { companyId: 10, title: 'Dev', description: 'Desc' }, mockCtx, {});
      expect(createdJob).toBeInstanceOf(JobPostingDTO);

      const createdApp = await m.applyToJob(null, { jobId: 1, candidateId: 10, candidateSkills: ['Dev'] }, mockCtx, {});
      expect(createdApp).toBeInstanceOf(JobApplicationDTO);
    });

    it('should return null for jobPosting query when job does not exist', async () => {
      (JobPosting.findByPk as jest.Mock).mockResolvedValue(null);
      const q = jobPostingsResolvers.Query;

      const res = await q.jobPosting(null, { id: 99 }, mockCtx, {});
      expect(res).toBeNull();
    });
  });

  describe('DTOs null check and malformed json', () => {
    it('should handle null and invalid required_skills gracefully', () => {
      const jNull = new JobPostingDTO(null);
      expect(jNull.id).toBeUndefined();

      const jInvalid = new JobPostingDTO({ id: 1, required_skills: 'invalid-json' });
      expect(jInvalid.requiredSkills).toEqual([]);

      const jArr = new JobPostingDTO({ id: 1, required_skills: ['TS'] });
      expect(jArr.requiredSkills).toEqual(['TS']);

      const aNull = new JobApplicationDTO(null);
      expect(aNull.id).toBeUndefined();
      expect(aNull.matchScore).toBe(0);
    });
  });
});
