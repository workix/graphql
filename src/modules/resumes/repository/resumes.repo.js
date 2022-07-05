const { QueryTypes } = require('sequelize');
import { RequestedFields } from '../../../RequestedFields';
import { Resume, ResumeEducation, ResumeExperience, ResumeSkill } from '../../../models';
import Paginator from '../../../utils/Paginator';
import PaginatedList from '../../../utils/PaginatedList';

const resumesRepository = db => {
    const requestedFields = new RequestedFields();
    const getFields = info => requestedFields.getFields(info, { keep: ["candidate_id", "id"], exclude: ["candidate", "educations", "experiences", "skills"] })
    const getFieldsWithSubfields = info => requestedFields.getFieldsWithSubfields(info, { keep: ["candidate_id", "id"], exclude: ["candidate", "educations", "experiences", "skills"] })

    const findAll = async (info, args) => {
        const fields = getFields(info)
        const options = { attributes: fields, order: ['id'] }
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
        const resume = await Resume.create(args.input, { include: [{ model: ResumeExperience, as: "experiences" }, { model: ResumeEducation, as: "educations" }, { model: ResumeSkill, as: "skills" }] })
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

        const [resumes, meta] = await Resume.update(args.input, { where: { id: args.id }, returning: true })

        const resume = await Resume.findOne({ where: { id: args.id } })

        return resume;
    }

    const findAllPaginated = async (info, args) => {

        const fields = getFieldsWithSubfields(info).get("rows")
        fields.push("candidate_id")

        const totalRows = await Resume.count()

        const paginator = new Paginator(args.limit, args.page, totalRows);

        const totalPages = paginator.getTotalPages();

        const start = paginator.getStart();

        const end = paginator.getEnd();

        const options = { attributes: fields, order: ['id'] }
        options.offset = start - 1;
        options.limit = args.limit;

        const resumes = await Resume.findAll(options)

        const paginatedList = new PaginatedList(resumes, start, end, totalPages, paginator.getCurrentPage(), paginator.getLimitRows(), paginator.getMaxRows())
        return paginatedList;
    }

    return { findAll, findById, create, destroy, update, findAllPaginated }
}

export default resumesRepository;