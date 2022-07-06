const { QueryTypes } = require('sequelize');
import { RequestedFields } from '../../../RequestedFields';
import { SelectiveProcess } from '../../../models';
import Paginator from '../../../utils/Paginator';
import PaginatedList from '../../../utils/PaginatedList';

const selectiveProcessesRepository = db => {
    const requestedFields = new RequestedFields();
    const getFields = info => requestedFields.getFields(info, { keep: ["job_id"], exclude: ["job", "candidates"] })
    const getFieldsWithSubfields = info => requestedFields.getFieldsWithSubfields(info, { keep: ["job_id"], exclude: ["job", "candidates"] })

    const findAll = async (info, args) => {
        const fields = getFields(info)
        const options = { attributes: fields, order: ['id'] }
        if (args.start != null && args.max != null) {
            options.offset = args.start;
            options.limit = args.max;
        }
        const selectiveProcesses = await SelectiveProcess.findAll(options)
        return selectiveProcesses;
    }

    const findById = async (info, args) => {
        const fields = getFields(info)
        const selectiveProcess = await SelectiveProcess.findOne({ where: { id: args.id }, attributes: fields })
        return selectiveProcess;
    }

    const create = async args => {
        const selectiveProcess = await SelectiveProcess.create(args.input)
        await selectiveProcess.reload()
        return selectiveProcess;
    }

    const destroy = async args => {
        const deleted = await SelectiveProcess.destroy({ where: { id: args.id } })
        return deleted > 0
    }

    const update = async args => {
        const f = await SelectiveProcess.findByPk(args.id, { attributes: ["id"], raw: true })

        if (!f) {
            throw new Error(`SelectiveProcess with id: ${args.id} not found`)
        }

        const [selectiveProcesses, meta] = await SelectiveProcess.update(args.input, { where: { id: args.id }, returning: true })       

        const selectiveProcess = await SelectiveProcess.findOne({ where: { id: args.id } })

        return selectiveProcess;
    }

    const findAllPaginated = async (info, args) => {           
        
        const fields = getFieldsWithSubfields(info).get("rows")              
        
        const totalRows = await SelectiveProcess.count()

        const paginator = new Paginator(args.limit, args.page, totalRows);

        const totalPages = paginator.getTotalPages();

		const start = paginator.getStart();

		const end = paginator.getEnd();		

        const options = { attributes: fields, order: ['id'] }
        options.offset = start - 1;
        options.limit = args.limit;

        const selectiveProcesses = await SelectiveProcess.findAll(options)

        const paginatedList = new PaginatedList(selectiveProcesses, start, end, totalPages, paginator.getCurrentPage(), paginator.getLimitRows(), paginator.getMaxRows())
        return paginatedList;
    }

    return { findAll, findById, create, destroy, update, findAllPaginated }
}

export default selectiveProcessesRepository;