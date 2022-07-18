import CandidateDTO from '../../../dtos/CandidateDTO';
import resumesRepository from '../repository/resumes.repo'
// import { Resume } from '../../../models';
import ResumeDTO from '../../../dtos/ResumeDTO'
import EducationDTO from '../../../dtos/EducationsDTO';
import ExperienceDTO from '../../../dtos/ExperienceDTO';
import SkillDTO from '../../../dtos/SkillDTO';

const resumesResolvers = {
    Query: {
        allResumes: async (parent, args, ctx, info) => {
            let resumes = await resumesRepository(ctx.orm).findAll(info, args)
            resumes = resumes.map(r => new ResumeDTO(r))
            return resumes;
        },
        getResumeById: async (parent, args, ctx, info) => {
            const resume = await resumesRepository(ctx.orm).findById(info, args)
            return new ResumeDTO(resume);
        },
        allResumesPaginated: async (parent, args, ctx, info) => {
            const paginatedList = await resumesRepository(ctx.orm).findAllPaginated(info, args)
            return paginatedList;
        }
    },
    Mutation: {
        createResume: async (parent, args, ctx, info) => {
            const resume = await resumesRepository(ctx.orm).create(args)
            return new ResumeDTO(resume);
        },
        deleteResume: async (parent, args, ctx, info) => {
            const deleted = await resumesRepository(ctx.orm).destroy(args)
            return deleted;
        },
        updateResume: async (parent, args, ctx, info) => {
            const resume = await resumesRepository(ctx.orm).update(args)
            return new ResumeDTO(resume);
        }
    },
    Resume: {
        candidate: async (parent, args, ctx, info) => {
            const candidates = await ctx.dataloaders.candidatesLoader.load({ key: parent.candidateId, info })
            return new CandidateDTO(candidates[0]);
        },
        educations: async (parent, args, ctx, info) => {
            let educations = await ctx.dataloaders.educationsLoader.load({ key: parent.id, info })
            educations = educations.map(e => new EducationDTO(e))
            return educations;
        },
        experiences: async (parent, args, ctx, info) => {
            let experiences = await ctx.dataloaders.experiencesLoader.load({ key: parent.id, info })
            experiences = experiences.map(e => new ExperienceDTO(e))
            return experiences;
        },
        skills: async (parent, args, ctx, info) => {
            let skills = await ctx.dataloaders.skillsLoader.load({ key: parent.id, info })
            skills = skills.map(s => new SkillDTO(s))        
            return skills;
        }
    }    
}

export default resumesResolvers;