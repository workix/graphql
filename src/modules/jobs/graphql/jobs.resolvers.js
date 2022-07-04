import _ from 'lodash';
import jobsRepository from '../repository/jobs.repo';
// import { Job } from '../../../models';

const jobsResolvers = {
    Query: {
        allJobs: async (parent, args, ctx, info) => {
            const jobs = await jobsRepository(ctx.orm).findAll(info, args)
            return jobs;
        },
        getJobById: async (parent, args, ctx, info) => {
            const job = await jobsRepository(ctx.orm).findById(info, args)
            return job;
        },
        allJobsPaginated: async (parent, args, ctx, info) => {
            const paginatedList = await jobsRepository(ctx.orm).findAllPaginated(info, args)
            return paginatedList;
        }
    },
    Mutation: {
        createJob: async (parent, args, ctx, info) => {
          const job = await jobsRepository(ctx.orm).create(args)
          return job;
        },
        deleteJob: async (parent, args, ctx, info) => {
          const deleted = await jobsRepository(ctx.orm).destroy(args)          
          return deleted;
        },
        updateJob: async (parent, args, ctx, info) => {
          const job = await jobsRepository(ctx.orm).update(args)
          return job;
        }
    },
    Job: {
        company: async (parent, args, ctx, info) => {
            const companies = await ctx.dataloaders.companiesLoader.load({ key: parent.company_id, info })            
            return companies[0];
        },
        candidates: async (parent, args, ctx, info) => {

            const subIds = await ctx.dataloaders.candidatesSubscribedJobsLoader.load({ key: parent.id, info })

            const candidates_ids = subIds.length ? subIds.map(i => ({ key: i.candidate_id, info: info })) : []

            const candidates = await ctx.dataloaders.candidatesLoader.loadMany(candidates_ids)

            return _.flatten(candidates);
        }
    }
}

export default jobsResolvers;