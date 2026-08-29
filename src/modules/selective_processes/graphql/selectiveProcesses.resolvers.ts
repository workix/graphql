import _ from 'lodash';
import selectiveProcessesRepository from '../repository/selective_processes.repo';
// import { SelectiveProcess } from '../../../models';
import { authResolver } from './../../../composable_resolvers/auth-resolver';
import { compose } from './../../../composable_resolvers/composable.resolver';
import { verifyTokenResolver } from './../../../composable_resolvers/verify-token-resolver';
import SelectiveProcessDTO from '../../../dtos/SelectiveProcessDTO'
import CandidateDTO from '../../../dtos/CandidateDTO'
import JobDTO from '../../../dtos/JobDTO'

const authGuard = [authResolver, verifyTokenResolver]

const selectiveProcessesResolvers = {
    Query: {
        allSelectiveProcesses: async (parent, args, ctx, info) => {
            let selectiveProcesses = await selectiveProcessesRepository(ctx.orm).findAll(info, args)
            selectiveProcesses = selectiveProcesses.map(sp => new SelectiveProcessDTO(sp))
            return selectiveProcesses;
        },
        getSelectiveProcessById: async (parent, args, ctx, info) => {
            const selectiveProcess = await selectiveProcessesRepository(ctx.orm).findById(info, args)
            return new SelectiveProcessDTO(selectiveProcess);
        },
        allSelectiveProcessesPaginated: async (parent, args, ctx, info) => {
            const paginatedList = await selectiveProcessesRepository(ctx.orm).findAllPaginated(info, args)
            return paginatedList;
        },
        mySelectiveProcessesSubscribed: compose(...authGuard)(async (parent, args, ctx, info) => {
            let selectiveProcesses = await selectiveProcessesRepository(ctx.orm).findMySPSubscribed(info, args, ctx)
            selectiveProcesses = selectiveProcesses.map(sp => new SelectiveProcessDTO(sp))
            return selectiveProcesses;
        }),
        mySelectiveProcesses: compose(...authGuard)(async (parent, args, ctx, info) => {
            let selectiveProcesses = await selectiveProcessesRepository(ctx.orm).findMySPs(info, args, ctx)
            selectiveProcesses = selectiveProcesses.map(sp => new SelectiveProcessDTO(sp))
            return selectiveProcesses;
        })
    },
    Mutation: {
        createSelectiveProcess: async (parent, args, ctx, info) => {
            const selectiveProcess = await selectiveProcessesRepository(ctx.orm).create(args)
            return new SelectiveProcessDTO(selectiveProcess);
        },
        deleteSelectiveProcess: async (parent, args, ctx, info) => {
            const deleted = await selectiveProcessesRepository(ctx.orm).destroy(args)
            return deleted;
        },
        updateSelectiveProcess: async (parent, args, ctx, info) => {
            const selectiveProcess = await selectiveProcessesRepository(ctx.orm).update(args)
            return new SelectiveProcessDTO(selectiveProcess);
        },
        subscribeInSelectiveProcess: async (parent, args, ctx, info) => {
            const subscribed = await selectiveProcessesRepository(ctx.orm).subscribe(args)
            return subscribed;
        }
    },
    SelectiveProcess: {
        job: async (parent, args, ctx, info) => {
            const jobs = await ctx.dataloaders.jobsLoader.load({ key: parent.jobId, info })
            return new JobDTO(jobs[0]);
        },
        candidates: async (parent, args, ctx, info) => {

            const subIds = await ctx.dataloaders.candidatesSubscribedSPLoader.load({ key: parent.id, info })

            const candidates_ids = subIds.length ? subIds.map(i => ({ key: i.candidate_id, info: info })) : []

            let candidates = await ctx.dataloaders.candidatesLoader.loadMany(candidates_ids)
            candidates = _.flatten(candidates)
            candidates = candidates.map(c => new CandidateDTO(c))

            return candidates;

        }
    }
}

export default selectiveProcessesResolvers;
