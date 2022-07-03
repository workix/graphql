const { QueryTypes } = require('sequelize');
import { RequestedFields } from '../../../RequestedFields';
import { JAASRole } from '../../../models';
import Paginator from '../../../utils/Paginator';
import PaginatedList from '../../../utils/PaginatedList';

const jaasRolesRepository = db => {
    const requestedFields = new RequestedFields();
    const getFields = info => requestedFields.getFields(info, { keep: ["id"], exclude: [] })
    const getFieldsWithSubfields = info => requestedFields.getFieldsWithSubfields(info, { keep: ["id"], exclude: [] })

    const findAll = async (info, args) => {
        const fields = getFields(info)
        const options = { attributes: fields, order: ['id'] }
        if (args.start != null && args.max != null) {
            options.offset = args.start;
            options.limit = args.max;
        }
        const jaasRoles = await JAASRole.findAll(options)
        return jaasRoles;
    }

    const findById = async (info, args) => {
        const fields = getFields(info)
        const jaasRole = await JAASRole.findOne({ where: { id: args.id }, attributes: fields })
        return jaasRole;
    }

    const create = async args => {
        const jaasRole = await JAASRole.create(args.input)
        await jaasRole.reload()
        return jaasRole;
    }

    const destroy = async args => {
        const deleted = await JAASRole.destroy({ where: { id: args.id } })
        return deleted > 0
    }

    const update = async args => {
        const [jaasRoles, meta] = await JAASRole.update(args.input, { where: { id: args.id }, returning: true })

        if (meta == 0) {
            throw new Error(`JAASRole with id: ${args.id} not found`)
        }

        const jaasRole = await JAASRole.findOne({ where: { id: args.id } })

        return jaasRole;
    }

    const findAllPaginated = async (info, args) => {           
        
        const fields = getFieldsWithSubfields(info).get("rows")              
        
        const totalRows = await JAASRole.count()

        const paginator = new Paginator(args.limit, args.page, totalRows);

        const totalPages = paginator.getTotalPages();

		const start = paginator.getStart();

		const end = paginator.getEnd();		

        const options = { attributes: fields, order: ['id'] }
        options.offset = start - 1;
        options.limit = args.limit;

        const jaasRoles = await JAASRole.findAll(options)

        const paginatedList = new PaginatedList(jaasRoles, start, end, totalPages, paginator.getCurrentPage(), paginator.getLimitRows(), paginator.getMaxRows())
        return paginatedList;
    }

    return { findAll, findById, create, destroy, update, findAllPaginated }
}

export default jaasRolesRepository;