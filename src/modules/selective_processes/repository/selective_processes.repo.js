const { QueryTypes } = require('sequelize');
import { RequestedFields } from '../../../RequestedFields';
import { SelectiveProcess,SelectiveProcessCandidate } from '../../../models';
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
        fields.push("job_id")            
        
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

    const subscribe = async args => {
        await SelectiveProcessCandidate.create({ sp_id: args.input.spId, candidate_id: args.input.candidateId })
        return true;
    }

    const findMySPSubscribed = async (info, args, ctx) => {

        const selectiveProcesses = await db.sequelize.query(`
        SELECT DISTINCT j.id, sp.* FROM selective_processes sp
        LEFT JOIN jobs j ON sp.job_id = j.id
        LEFT JOIN selective_processes_candidates spc ON sp.id = spc.sp_id
        LEFT JOIN candidates ON spc.candidate_id = candidates.id
        LEFT JOIN users u ON candidates.user_id = u.id
                         WHERE u.firebaseUUID = :firebaseUUID ORDER BY j.id`, {
                            replacements: { firebaseUUID: ctx.user.firebaseUUID },
                            type: QueryTypes.SELECT
                          })
        return selectiveProcesses;
    }

    const findMySPs = async (info, args, ctx) => {

        const selectiveProcesses = await db.sequelize.query(`
        SELECT DISTINCT j.id, sp.* FROM selective_processes sp 
        LEFT JOIN jobs j ON sp.job_id = j.id 
        LEFT JOIN companies c ON j.company_id = c.id 
        LEFT JOIN users u ON c.user_id = u.id 
                         WHERE u.firebaseUUID = :firebaseUUID ORDER BY j.id`, {
                            replacements: { firebaseUUID: ctx.user.firebaseUUID },
                            type: QueryTypes.SELECT
                          })
        return selectiveProcesses;
    }

    return { findAll, findById, create, destroy, update, findAllPaginated, subscribe, findMySPSubscribed, findMySPs }
}

export default selectiveProcessesRepository;