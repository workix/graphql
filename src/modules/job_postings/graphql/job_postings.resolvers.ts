import jobPostingsRepository from '../repository/job_postings.repo';
import JobPostingDTO from '../../../dtos/JobPostingDTO';
import JobApplicationDTO from '../../../dtos/JobApplicationDTO';

const jobPostingsResolvers = {
  Query: {
    jobPostings: async (parent: any, args: any, ctx: any, info: any) => {
      const list = await jobPostingsRepository(ctx.orm).getJobPostings(args.companyId, args.limit, args.offset);
      return list.map((j: any) => new JobPostingDTO(j));
    },
    jobPosting: async (parent: any, args: any, ctx: any, info: any) => {
      const job = await jobPostingsRepository(ctx.orm).getJobPostingById(args.id);
      return job ? new JobPostingDTO(job) : null;
    },
    jobApplications: async (parent: any, args: any, ctx: any, info: any) => {
      const list = await jobPostingsRepository(ctx.orm).getJobApplications(args.jobId);
      return list.map((a: any) => new JobApplicationDTO(a));
    }
  },
  Mutation: {
    createJobPosting: async (parent: any, args: any, ctx: any, info: any) => {
      const job = await jobPostingsRepository(ctx.orm).createJobPosting(
        args.companyId,
        args.title,
        args.description,
        args.location,
        args.workType,
        args.requiredSkills
      );
      return new JobPostingDTO(job);
    },
    applyToJob: async (parent: any, args: any, ctx: any, info: any) => {
      const app = await jobPostingsRepository(ctx.orm).applyToJob(
        args.jobId,
        args.candidateId,
        args.candidateSkills,
        args.resumeId
      );
      return new JobApplicationDTO(app);
    }
  }
};

export default jobPostingsResolvers;
