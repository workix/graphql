const { QueryTypes } = require('sequelize');
import { RequestedFields } from '../../../RequestedFields';
import { Resume, ResumeEducation, ResumeExperience, ResumeSkill } from '../../../models';
import Paginator from '../../../utils/Paginator';
import PaginatedList from '../../../utils/PaginatedList';
import ResumeDTO from '../../../dtos/ResumeDTO';
import { CreateResumeDTO, UpdateResumeDTO } from '../../../dtos/ResumeMutationDTO'
import { CreateEducationDTO } from '../../../dtos/EducationsMutationDTO'
import { CreateExperienceDTO } from '../../../dtos/ExperienceMutationDTO'
import { CreateSkillDTO } from '../../../dtos/SkillMutationDTO'
const resumesRepository = db => {
    const requestedFields = new RequestedFields();
    const getFields = info => requestedFields.getFields(info, { keep: ["candidate_id", "id"], exclude: ["candidate", "educations", "experiences", "skills"] })
    const getFieldsWithSubfields = info => requestedFields.getFieldsWithSubfields(info, { keep: ["candidate_id", "id"], exclude: ["candidate", "educations", "experiences", "skills"] })

    const findAll = async (info, args) => {
        const fields = getFields(info)
        const options: any = { attributes: fields, order: ['id'] }
        if (args.start != null && args.max != null) {
            options.offset = args.start;
            options.limit = args.max;
        }
        const resumes = await Resume.findAll(options)
        return resumes;
    }

    const findById = async (info, args) => {
        const fields = getFields(info)
        const resume = await Resume.findOne({ where: { id: args.id }, attributes: fields })
        return resume;
    }

    const create = async args => {
        const candidateId = Number(args.input.candidateId || 1);
        const existing = await Resume.findOne({ where: { candidate_id: candidateId } });
        if (existing) {
            return await update({ id: existing.id, input: args.input });
        }

        let resume;
        await db.sequelize.transaction(async transaction => {
            resume = await Resume.create(new CreateResumeDTO(args.input), { transaction });
            const resumeId = resume.id;

            if (args.input.educations && Array.isArray(args.input.educations)) {
                for (const e of args.input.educations) {
                    const educationInput = {
                        id: resumeId,
                        description: e.description || '',
                        endDate: e.endDate || null,
                        qualification: e.qualification || '',
                        schoolName: e.schoolName || '',
                        startDate: e.startDate || new Date().toISOString().slice(0, 10)
                    };
                    await ResumeEducation.create(new CreateEducationDTO(educationInput), { transaction });
                }
            }

            if (args.input.experiences && Array.isArray(args.input.experiences)) {
                for (const e of args.input.experiences) {
                    const experienceInput = {
                        id: resumeId,
                        description: e.description || '',
                        employerName: e.employerName || '',
                        endDate: e.endDate || null,
                        jobTitle: e.jobTitle || '',
                        responsibilities: e.responsibilities || e.description || '',
                        startDate: e.startDate || new Date().toISOString().slice(0, 10)
                    };
                    await ResumeExperience.create(new CreateExperienceDTO(experienceInput), { transaction });
                }
            }

            if (args.input.skills && Array.isArray(args.input.skills)) {
                for (const s of args.input.skills) {
                    const skillInput = {
                        id: resumeId,
                        months: Number(s.months || 0),
                        skillName: s.skillName || ''
                    };
                    await ResumeSkill.create(new CreateSkillDTO(skillInput), { transaction });
                }
            }
        });

        if (resume && typeof resume.reload === 'function') {
            await resume.reload();
        }
        return resume;
    }

    const destroy = async args => {
        const deleted = await Resume.destroy({ where: { id: args.id } })
        return deleted > 0
    }

    const update = async args => {
        const f = await Resume.findByPk(args.id, { attributes: ["id"], raw: true })

        if (!f) {
            throw new Error(`Resume with id: ${args.id} not found`)
        }

        let resume;
        await db.sequelize.transaction(async transaction => {
            await Resume.update(new UpdateResumeDTO(args.input), { where: { id: args.id }, returning: true, individualHooks: true, transaction });

            resume = await Resume.findOne({ where: { id: args.id }, transaction });

            if (args.input.educations && Array.isArray(args.input.educations)) {
                await ResumeEducation.destroy({ where: { id: args.id }, transaction });

                for (const e of args.input.educations) {
                    const educationInput = {
                        id: args.id,
                        description: e.description || '',
                        endDate: e.endDate || null,
                        qualification: e.qualification || '',
                        schoolName: e.schoolName || '',
                        startDate: e.startDate || new Date().toISOString().slice(0, 10)
                    };
                    await ResumeEducation.create(new CreateEducationDTO(educationInput), { transaction });
                }
            }

            if (args.input.experiences && Array.isArray(args.input.experiences)) {
                await ResumeExperience.destroy({ where: { id: args.id }, transaction });

                for (const e of args.input.experiences) {
                    const experienceInput = {
                        id: args.id,
                        description: e.description || '',
                        employerName: e.employerName || '',
                        endDate: e.endDate || null,
                        jobTitle: e.jobTitle || '',
                        responsibilities: e.responsibilities || e.description || '',
                        startDate: e.startDate || new Date().toISOString().slice(0, 10)
                    };
                    await ResumeExperience.create(new CreateExperienceDTO(experienceInput), { transaction });
                }
            }

            if (args.input.skills && Array.isArray(args.input.skills)) {
                await ResumeSkill.destroy({ where: { id: args.id }, transaction });

                for (const s of args.input.skills) {
                    const skillInput = {
                        id: args.id,
                        months: Number(s.months || 0),
                        skillName: s.skillName || ''
                    };
                    await ResumeSkill.create(new CreateSkillDTO(skillInput), { transaction });
                }
            }
        });

        return resume;
    }

    const findAllPaginated = async (info, args) => {

        const fields = getFieldsWithSubfields(info).get("resumes") || []
        fields.push("candidate_id")

        const totalRows = await Resume.count()

        const paginator = new Paginator(args.limit, args.page, totalRows);

        const totalPages = paginator.getTotalPages();

        const start = paginator.getStart();

        const end = paginator.getEnd();

        const options: any = { attributes: fields, order: ['id'] }
        options.offset = start - 1;
        options.limit = args.limit;

        let resumes = await Resume.findAll(options)
        resumes = resumes.map(r => new ResumeDTO(r))

        const paginatedList = new PaginatedList('resumes', resumes, start, end, totalPages, paginator.getCurrentPage(), paginator.getLimitRows(), paginator.getMaxRows())
        return paginatedList;
    }

    return { findAll, findById, create, destroy, update, findAllPaginated }
}

export default resumesRepository;
