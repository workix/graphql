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
        },
        getNormalizedResume: async (parent, args, ctx, info) => {
            const { NormalizedResume } = require('../../../models');
            const resume = await NormalizedResume.findOne({ where: { candidate_id: args.candidateId } });
            if (!resume) return null;
            let skillsArray = [];
            try {
                skillsArray = Array.isArray(resume.skills) ? resume.skills : JSON.parse(resume.skills || '[]');
            } catch {
                skillsArray = typeof resume.skills === 'string' ? resume.skills.split(',').map((s: string) => s.trim()) : [];
            }
            return {
                id: resume.id,
                candidateId: resume.candidate_id,
                rawMarkdown: resume.raw_markdown,
                summary: resume.summary,
                skills: skillsArray,
                careerGoals: resume.career_goals,
                completenessScore: resume.completeness_score,
                createdAt: resume.created_at,
                updatedAt: resume.updated_at
            };
        },
        compileNormalizedResume: async (parent, args, ctx, info) => {
            const { resumeNormalizationService } = require('../../../services/resume_normalization.service');
            return await resumeNormalizationService.compileFromCandidateProfile(Number(args.candidateId));
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
        },
        saveNormalizedResume: async (parent, args, ctx, info) => {
            const { resumeNormalizationService } = require('../../../services/resume_normalization.service');
            const record = await resumeNormalizationService.saveNormalizedResume(Number(args.candidateId), args.rawMarkdown);
            let skillsArray = [];
            try {
                skillsArray = Array.isArray(record.skills) ? record.skills : JSON.parse(record.skills || '[]');
            } catch {
                skillsArray = typeof record.skills === 'string' ? record.skills.split(',').map((s: string) => s.trim()) : [];
            }
            return {
                id: record.id,
                candidateId: record.candidate_id,
                rawMarkdown: record.raw_markdown,
                summary: record.summary,
                skills: skillsArray,
                careerGoals: record.career_goals,
                completenessScore: record.completeness_score,
                createdAt: record.created_at,
                updatedAt: record.updated_at
            };
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
