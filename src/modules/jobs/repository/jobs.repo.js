const { QueryTypes } = require('sequelize');
import { RequestedFields } from '../../../RequestedFields';
import { Job } from '../../../models';
import Paginator from '../../../utils/Paginator';
import PaginatedList from '../../../utils/PaginatedList';

const jobsRepository = db => {
    const requestedFields = new RequestedFields();
    const getFields = info => requestedFields.getFields(info, { keep: ["id", "company_id"], exclude: ["company", "candidates"] })
    const getFieldsWithSubfields = info => requestedFields.getFieldsWithSubfields(info, { keep: ["id", "company_id"], exclude: ["company", "candidates"] })

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

    return { findAll, findById, create, destroy, update, findAllPaginated }
}

export default jobsRepository;