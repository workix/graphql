import _ from 'lodash';
import selectiveProcessesRepository from '../repository/selective_processes.repo';
// import { SelectiveProcess } from '../../../models';
import { authResolver } from './../../../composable_resolvers/auth-resolver';
import { compose } from './../../../composable_resolvers/composable.resolver';
import { verifyTokenResolver } from './../../../composable_resolvers/verify-token-resolver';

const authGuard = [authResolver, verifyTokenResolver]

const selectiveProcessesResolvers = {
    Query: {
        allSelectiveProcesses: async (parent, args, ctx, info) => {
            const selectiveProcesses = await selectiveProcessesRepository(ctx.orm).findAll(info, args)
            return selectiveProcesses;
        },
        getSelectiveProcessById: async (parent, args, ctx, info) => {
            const selectiveProcess = await selectiveProcessesRepository(ctx.orm).findById(info, args)
            return selectiveProcess;
        },
        allSelectiveProcessesPaginated: async (parent, args, ctx, info) => {
            const paginatedList = await selectiveProcessesRepository(ctx.orm).findAllPaginated(info, args)
            return paginatedList;
        },
        mySelectiveProcessesSubscribed: compose(...authGuard)(async (parent, args, ctx, info) => {
            const selectiveProcesses = await selectiveProcessesRepository(ctx.orm).findMySPSubscribed(info, args, ctx)
            return selectiveProcesses;
        })
    },
    Mutation: {
        createSelectiveProcess: async (parent, args, ctx, info) => {
            const selectiveProcess = await selectiveProcessesRepository(ctx.orm).create(args)
            return selectiveProcess;
        },
        deleteSelectiveProcess: async (parent, args, ctx, info) => {
            const deleted = await selectiveProcessesRepository(ctx.orm).destroy(args)
            return deleted;
        },
        updateSelectiveProcess: async (parent, args, ctx, info) => {
            const selectiveProcess = await selectiveProcessesRepository(ctx.orm).update(args)
            return selectiveProcess;
        },
        subscribeInSelectiveProcess: async (parent, args, ctx, info) => {
            const subscribed = await selectiveProcessesRepository(ctx.orm).subscribe(args)
            return subscribed;
        }
    },
    SelectiveProcess: {
        job: async (parent, args, ctx, info) => {
            const jobs = await ctx.dataloaders.jobsLoader.load({ key: parent.job_id, info })
            return jobs[0];
        },
        candidates: async (parent, args, ctx, info) => {

            const subIds = await ctx.dataloaders.candidatesSubscribedSPLoader.load({ key: parent.id, info })

            const candidates_ids = subIds.length ? subIds.map(i => ({ key: i.candidate_id, info: info })) : []

            const candidates = await ctx.dataloaders.candidatesLoader.loadMany(candidates_ids)

            return _.flatten(candidates);

        }
    }
}

export default selectiveProcessesResolvers;