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
        const options: any = { include: [] };
        if (args.input.experiences) {
            options.include.push({ model: ResumeExperience, as: "experiences" })
        }
        if (args.input.educations){
            options.include.push({ model: ResumeEducation, as: "educations" })
        }
        if (args.input.skills) {
            options.include.push({ model: ResumeSkill, as: "skills" })
        }
        const resume = await Resume.create(new CreateResumeDTO(args.input), options)
        await resume.reload()
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
            // chain all your queries here. make sure you return them.
            const [resumes, meta] = await Resume.update(new UpdateResumeDTO(args.input), { where: { id: args.id }, returning: true, individualHooks: true }, { transaction })

            resume = await Resume.findOne({ where: { id: args.id } })

            if (args.input.educations) {
                await ResumeEducation.destroy({ where: { id: args.id } }, { transaction })

                for (const e of args.input.educations) {
                    const educationInput = { id: args.id, description: e.description, endDate: e.endDate, qualification: e.qualification, schoolName: e.schoolName, startDate: e.startDate }
                    await ResumeEducation.create(new CreateEducationDTO(educationInput), { transaction })
                }
            }

            if (args.input.experiences) {
                await ResumeExperience.destroy({ where: { id: args.id } }, { transaction })

                for (const e of args.input.experiences) {
                    const experienceInput = { id: args.id, description: e.description, employerName: e.employerName, endDate: e.endDate, jobTitle: e.jobTitle, responsibilities: e.responsibilities, startDate: e.startDate }
                    await ResumeExperience.create(new CreateExperienceDTO(experienceInput), { transaction })
                }
            }

            if (args.input.skills) {
                await ResumeSkill.destroy({ where: { id: args.id } }, { transaction })

                for (const s of args.input.skills) {
                    const skillInput = { id: args.id, months: s.months, skillName: s.skillName }
                    await ResumeSkill.create(new CreateSkillDTO(skillInput), { transaction })
                }
            }
        })

        return resume;
    }

    const findAllPaginated = async (info, args) => {

        const fields = getFieldsWithSubfields(info).get("resumes")
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
