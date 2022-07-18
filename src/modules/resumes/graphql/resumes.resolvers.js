import CandidateDTO from '../../../dtos/CandidateDTO';
import resumesRepository from '../repository/resumes.repo'
// import { Resume } from '../../../models';

const resumesResolvers = {
    Query: {
        allResumes: async (parent, args, ctx, info) => {
            const resumes = await resumesRepository(ctx.orm).findAll(info, args)
            return resumes;
        },
        getResumeById: async (parent, args, ctx, info) => {
            const resume = await resumesRepository(ctx.orm).findById(info, args)
            return resume;
        },
        allResumesPaginated: async (parent, args, ctx, info) => {
            const paginatedList = await resumesRepository(ctx.orm).findAllPaginated(info, args)
            return paginatedList;
        }
    },
    Mutation: {
        createResume: async (parent, args, ctx, info) => {
            const resume = await resumesRepository(ctx.orm).create(args)
            return resume;
        },
        deleteResume: async (parent, args, ctx, info) => {
            const deleted = await resumesRepository(ctx.orm).destroy(args)
            return deleted;
        },
        updateResume: async (parent, args, ctx, info) => {
            const resume = await resumesRepository(ctx.orm).update(args)
            return resume;
        }
    },
    Resume: {
        candidate: async (parent, args, ctx, info) => {
            const candidates = await ctx.dataloaders.candidatesLoader.load({ key: parent.candidateId, info })
            return new CandidateDTO(candidates[0]);
        },
        educations: async (parent, args, ctx, info) => {
            const educations = await ctx.dataloaders.educationsLoader.load({ key: parent.id, info })
            return educations;
        },
        experiences: async (parent, args, ctx, info) => {
            const experiences = await ctx.dataloaders.experiencesLoader.load({ key: parent.id, info })
            return experiences;
        },
        skills: async (parent, args, ctx, info) => {
            const skills = await ctx.dataloaders.skillsLoader.load({ key: parent.id, info })
            return skills;
        }
    },
    CarrerLevel: {
        JUNIOR: 0,
        MIDDLE: 1,
        SENIOR: 2,
        EXPERT: 3
    },
    Presence: {
        REMOTE: 0,
        OFFICE: 1,
        RELOCATION: 2,
        TRAVEL_A_LOT: 3
    }
}

export default resumesResolvers;