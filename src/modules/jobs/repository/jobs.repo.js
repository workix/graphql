const { QueryTypes, Sequelize } = require('sequelize');
import { RequestedFields } from '../../../RequestedFields';
import { Job, JobCandidate } from '../../../models';
import Paginator from '../../../utils/Paginator';
import PaginatedList from '../../../utils/PaginatedList';

const jobsRepository = db => {
    const requestedFields = new RequestedFields();
    const getFields = info => requestedFields.getFields(info, { keep: ["id", "company_id"], exclude: ["company", "candidates"] })
    const getFieldsWithSubfields = info => requestedFields.getFieldsWithSubfields(info, { keep: ["id", "company_id"], exclude: ["company", "candidates"] })


    const findAllByCompany = async (info, args) => {
        const fields = getFields(info)
        const options = { attributes: fields, order: [['id', 'ASC']], where: { company_id: args.companyId } }
        const jobs = await Job.findAll(options)
        return jobs;
    }

    const listRandomFeatured = async (info, args) => {
        const fields = getFields(info)
        const options = { attributes: fields, order: [Sequelize.fn('RAND')], where: { feature: true } }
        const jobs = await Job.findAll(options)
        return jobs;
    }

    const findAllFeatured = async (info, args) => {
        const fields = getFields(info)
        const options = { attributes: fields, order: ['id'], where: { feature: args.featured } }
        if (args.start != null && args.max != null) {
            options.offset = args.start;
            options.limit = args.max;
        }
        const jobs = await Job.findAll(options)
        return jobs;
    }


    const findAll = async (info, args) => {
        const fields = getFields(info)
        const options = { attributes: fields, order: ['id'] }
        if (args.start != null && args.max != null) {
            options.offset = args.start;
            options.limit = args.max;
        }
        const jobs = await Job.findAll(options)
        return jobs;
    }

    const findById = async (info, args) => {
        const fields = getFields(info)
        const job = await Job.findOne({ where: { id: args.id }, attributes: fields })
        return job;
    }

    const findByIdAndCompanyId = async (info, args) => {
        const fields = getFields(info)
        const job = await Job.findOne({ where: { id: args.id, company_id: args.companyId }, attributes: fields })
        return job;
    }

    const create = async args => {
        const job = await Job.create(args.input)
        await job.reload()
        return job;
    }

    const destroy = async args => {
        const deleted = await Job.destroy({ where: { id: args.id } })
        return deleted > 0
    }

    const update = async args => {
        const j = await Job.findByPk(args.id, { attributes: ["id"], raw: true })

        if (!j) {
            throw new Error(`Job with id: ${args.id} not found`)
        }

        const [jobs, meta] = await Job.update(args.input, { where: { id: args.id }, returning: true })

        const job = await Job.findOne({ where: { id: args.id } })

        return job;
    }

    const findAllPaginated = async (info, args) => {

        const fields = getFieldsWithSubfields(info).get("rows")
        fields.push("company_id")

        const totalRows = await Job.count()

        const paginator = new Paginator(args.limit, args.page, totalRows);

        const totalPages = paginator.getTotalPages();

        const start = paginator.getStart();

        const end = paginator.getEnd();

        const options = { attributes: fields, order: ['id'] }
        options.offset = start - 1;
        options.limit = args.limit;

        const jobs = await Job.findAll(options)

        const paginatedList = new PaginatedList(jobs, start, end, totalPages, paginator.getCurrentPage(), paginator.getLimitRows(), paginator.getMaxRows())
        return paginatedList;
    }

    const subscribe = async args => {
        await JobCandidate.create({ Job_id: args.input.jobId, candidates_id: args.input.candidateId })
        return true;
    }

    return { findAll, findById, create, destroy, update, findAllPaginated, findAllFeatured, listRandomFeatured, findAllByCompany, subscribe, findByIdAndCompanyId }
}

export default jobsRepository;