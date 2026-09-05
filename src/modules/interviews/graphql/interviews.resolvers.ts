import { interviewService } from '../services/interview.service';
import CompanyDTO from '../../../dtos/CompanyDTO';
import CandidateDTO from '../../../dtos/CandidateDTO';
import JobDTO from '../../../dtos/JobDTO';
import { Job } from '../../../models';

const formatInterviewDTO = (interview: any) => {
  if (!interview) return null;
  const raw = interview.toJSON ? interview.toJSON() : interview;
  return {
    id: raw.id,
    uuid: raw.uuid,
    companyId: raw.company_id || raw.companyId,
    candidateId: raw.candidate_id || raw.candidateId,
    jobId: raw.job_id || raw.jobId,
    title: raw.title,
    description: raw.description,
    scheduledAt: raw.scheduled_at || raw.scheduledAt,
    durationMinutes: raw.duration_minutes || raw.durationMinutes,
    format: raw.format,
    meetingLink: raw.meeting_link || raw.meetingLink,
    locationAddress: raw.location_address || raw.locationAddress,
    status: raw.status,
    rescheduleReason: raw.reschedule_reason || raw.rescheduleReason,
    feedbackNotes: raw.feedback_notes || raw.feedbackNotes,
    candidateFeedback: raw.candidate_feedback || raw.candidateFeedback,
    createdAt: raw.created_at || raw.createdAt,
    updatedAt: raw.updated_at || raw.updatedAt,
    company: raw.company,
    candidate: raw.candidate,
    job: raw.job,
  };
};

const interviewsResolvers = {
  Query: {
    getInterviewById: async (_parent: any, args: { id: string }, ctx: any) => {
      const interview = await interviewService.getInterviewById(parseInt(args.id, 10));
      return formatInterviewDTO(interview);
    },
    listInterviewsByCompany: async (_parent: any, args: { companyId: string; filter?: any }, ctx: any) => {
      const interviews = await interviewService.listInterviewsByCompany(parseInt(args.companyId, 10), args.filter);
      return interviews.map(formatInterviewDTO);
    },
    listInterviewsByCandidate: async (_parent: any, args: { candidateId: string; filter?: any }, ctx: any) => {
      const interviews = await interviewService.listInterviewsByCandidate(parseInt(args.candidateId, 10), args.filter);
      return interviews.map(formatInterviewDTO);
    },
  },
  Mutation: {
    createInterview: async (_parent: any, args: { input: any }, ctx: any) => {
      const interview = await interviewService.createInterview({
        companyId: parseInt(args.input.companyId, 10),
        candidateId: parseInt(args.input.candidateId, 10),
        jobId: args.input.jobId ? parseInt(args.input.jobId, 10) : null,
        title: args.input.title,
        description: args.input.description,
        scheduledAt: args.input.scheduledAt,
        durationMinutes: args.input.durationMinutes,
        format: args.input.format,
        meetingLink: args.input.meetingLink,
        locationAddress: args.input.locationAddress,
      }, ctx?.user);
      return formatInterviewDTO(interview);
    },
    updateInterview: async (_parent: any, args: { id: string; input: any }, ctx: any) => {
      const interview = await interviewService.updateInterview(parseInt(args.id, 10), args.input, ctx?.user);
      return formatInterviewDTO(interview);
    },
    respondInterview: async (_parent: any, args: { id: string; input: any }, ctx: any) => {
      const interview = await interviewService.respondInterview(parseInt(args.id, 10), args.input, ctx?.user);
      return formatInterviewDTO(interview);
    },
    cancelInterview: async (_parent: any, args: { id: string; reason?: string }, ctx: any) => {
      const interview = await interviewService.cancelInterview(parseInt(args.id, 10), args.reason, ctx?.user);
      return formatInterviewDTO(interview);
    },
  },
  Interview: {
    company: async (parent: any, _args: any, ctx: any, info: any) => {
      if (parent.company) return new CompanyDTO(parent.company);
      if (!parent.companyId) return null;
      if (ctx?.dataloaders?.companiesLoader) {
        const companies = await ctx.dataloaders.companiesLoader.load({ key: parent.companyId, info });
        return companies && companies[0] ? new CompanyDTO(companies[0]) : null;
      }
      return null;
    },
    candidate: async (parent: any, _args: any, ctx: any, info: any) => {
      if (parent.candidate) return new CandidateDTO(parent.candidate);
      if (!parent.candidateId) return null;
      if (ctx?.dataloaders?.candidatesLoader) {
        const candidates = await ctx.dataloaders.candidatesLoader.load({ key: parent.candidateId, info });
        return candidates && candidates[0] ? new CandidateDTO(candidates[0]) : null;
      }
      return null;
    },
    job: async (parent: any) => {
      if (parent.job) return new JobDTO(parent.job);
      if (!parent.jobId) return null;
      const job = await Job.findByPk(parent.jobId);
      return job ? new JobDTO(job) : null;
    },
  },
};

export default interviewsResolvers;
