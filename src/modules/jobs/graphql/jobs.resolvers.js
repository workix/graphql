import _ from 'lodash';
import jobsRepository from '../repository/jobs.repo';
import { Job, Candidate } from '../../../models';

import { authResolver } from './../../../composable_resolvers/auth-resolver';
import { compose } from './../../../composable_resolvers/composable.resolver';
import { verifyTokenResolver } from './../../../composable_resolvers/verify-token-resolver';
import JobDTO from '../../../dtos/JobDTO'
import CandidateDTO from '../../../dtos/CandidateDTO'
import CompanyDTO from '../../../dtos/CompanyDTO'

const authGuard = [authResolver, verifyTokenResolver]

const jobsResolvers = {
    Query: {
        allJobs: async (parent, args, ctx, info) => {
            let jobs = await jobsRepository(ctx.orm).findAll(info, args)
            jobs = jobs.map(j => new JobDTO(j))
            return jobs;
        },
        getJobById: async (parent, args, ctx, info) => {
            const job = await jobsRepository(ctx.orm).findById(info, args)
            return new JobDTO(job);
        },
        allJobsPaginated: async (parent, args, ctx, info) => {
            const paginatedList = await jobsRepository(ctx.orm).findAllPaginated(info, args)
            return paginatedList;
        },
        debugJob: async (parent, args, ctx, info) => {
            let jobs = await Job.findAll({ include: [{ model: Candidate, as: "candidates" }] })
            console.log("Jobs Candidates ->", await jobs[0].getCandidates({ raw: true }))
            console.log("Jobs Company ->", await jobs[0].getCompany({ raw: true }))
            jobs = jobs.map(j => new JobDTO(j))
            return jobs
        },
        allJobsFeatured: async (parent, args, ctx, info) => {
            let jobs = await jobsRepository(ctx.orm).findAllFeatured(info, args)
            jobs = jobs.map(j => new JobDTO(j))
            return jobs;
        },
        listJobRandomFeatured: async (parent, args, ctx, info) => {
            let jobs = await jobsRepository(ctx.orm).listRandomFeatured(info, args)
            jobs = jobs.map(j => new JobDTO(j))
            return jobs;
        },
        getJobByCompanyId: async (parent, args, ctx, info) => {
            let jobs = await jobsRepository(ctx.orm).findAllByCompany(info, args)
            jobs = jobs.map(j => new JobDTO(j))
            return jobs;
        },
        getJobByIdAndCompanyId: async (parent, args, ctx, info) => {
            const job = await jobsRepository(ctx.orm).findByIdAndCompanyId(info, args)
            return new JobDTO(job);
        },
        myJobs: compose(...authGuard)(async (parent, args, ctx, info) => {
            let jobs = await jobsRepository(ctx.orm).findMyJobs(info, args, ctx)
            jobs = jobs.map(j => new JobDTO(j))
            return jobs;
        })
    },
    Mutation: {
        createJob: async (parent, args, ctx, info) => {
            const job = await jobsRepository(ctx.orm).create(args)
            return new JobDTO(job);
        },
        deleteJob: async (parent, args, ctx, info) => {
            const deleted = await jobsRepository(ctx.orm).destroy(args)
            return deleted;
        },
        updateJob: async (parent, args, ctx, info) => {
            const job = await jobsRepository(ctx.orm).update(args)
            return new JobDTO(job);
        },
        subscribeInJob: async (parent, args, ctx, info) => {
            const subscribed = await jobsRepository(ctx.orm).subscribe(args)
            return subscribed;
        }
    },
    Job: {
        company: async (parent, args, ctx, info) => {
            const companies = await ctx.dataloaders.companiesLoader.load({ key: parent.companyId, info })
            return new CompanyDTO(companies[0]);
        },
        candidates: async (parent, args, ctx, info) => {

            const subIds = await ctx.dataloaders.candidatesSubscribedJobsLoader.load({ key: parent.id, info })            

            const candidates_ids = subIds.length ? subIds.map(i => ({ key: i.candidate_id, info: info })) : []            

            let candidates = await ctx.dataloaders.candidatesLoader.loadMany(candidates_ids)
            candidates = _.flatten(candidates)
            candidates = candidates.map(c => new CandidateDTO(c))           

            return candidates;
        }
    }
}

export default jobsResolvers;