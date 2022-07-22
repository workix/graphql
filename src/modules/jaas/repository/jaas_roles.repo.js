const { QueryTypes } = require('sequelize');
import { RequestedFields } from '../../../RequestedFields';
import { JAASRole } from '../../../models';
import Paginator from '../../../utils/Paginator';
import PaginatedList from '../../../utils/PaginatedList';
import JAASRoleDTO from '../../../dtos/JAASRoleDTO';
import { CreateJAASRoleDTO, UpdateJAASRoleDTO } from '../../../dtos/JAASRoleMutationDTO'

const jaasRolesRepository = db => {
    const requestedFields = new RequestedFields();
    const getFields = info => requestedFields.getFields(info, { keep: [], exclude: [] })
    const getFieldsWithSubfields = info => requestedFields.getFieldsWithSubfields(info, { keep: [], exclude: [] })

    const findAll = async (info, args) => {
        const fields = getFields(info)
        const options = { attributes: fields, order: ['name'] }
        if (args.start != null && args.max != null) {
            options.offset = args.start;
            options.limit = args.max;
        }
        const jaasRoles = await JAASRole.findAll(options)
        return jaasRoles;
    }

    const findByName = async (info, args) => {
        const fields = getFields(info)
        const jaasRole = await JAASRole.findOne({ where: { name: args.name }, attributes: fields })
        return jaasRole;
    }

    const create = async args => {
        const jaasRole = await JAASRole.create(new CreateJAASRoleDTO(args.input))
        await jaasRole.reload()
        return jaasRole;
    }

    const destroy = async args => {
        const deleted = await JAASRole.destroy({ where: { name: args.name } })
        return deleted > 0
    }

    const update = async args => {

        const r = await JAASRole.findByPk(args.name, { attributes: ["name"], raw: true })

        if (!r) {
            throw new Error(`JAASRole with name: ${args.name} not found`)
        }

        const [jaasRoles, meta] = await JAASRole.update(new UpdateJAASRoleDTO(args.input) , { where: { name: args.name }, returning: true })

        const jaasRole = await JAASRole.findOne({ where: { name: args.input.name } })

        return jaasRole;
    }

    const findAllPaginated = async (info, args) => {

        const fields = getFieldsWithSubfields(info).get("jaasRoles")

        const totalRows = await JAASRole.count()

        const paginator = new Paginator(args.limit, args.page, totalRows);

        const totalPages = paginator.getTotalPages();

        const start = paginator.getStart();

        const end = paginator.getEnd();

        const options = { attributes: fields, order: ['name'] }
        options.offset = start - 1;
        options.limit = args.limit;

        let jaasRoles = await JAASRole.findAll(options)
        jaasRoles = jaasRoles.map(r => new JAASRoleDTO(r))

        const paginatedList = new PaginatedList('jaasRoles', jaasRoles, start, end, totalPages, paginator.getCurrentPage(), paginator.getLimitRows(), paginator.getMaxRows())
        return paginatedList;
    }

    return { findAll, findByName, create, destroy, update, findAllPaginated }
}

export default jaasRolesRepository;