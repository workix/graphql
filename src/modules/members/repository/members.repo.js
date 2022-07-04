const { QueryTypes } = require('sequelize');
import { RequestedFields } from '../../../RequestedFields';
import { Member } from '../../../models';
import Paginator from '../../../utils/Paginator';
import PaginatedList from '../../../utils/PaginatedList';

const membersRepository = db => {
    const requestedFields = new RequestedFields();
    const getFields = info => requestedFields.getFields(info, { keep: ["id"], exclude: ["medias"] })
    const getFieldsWithSubfields = info => requestedFields.getFieldsWithSubfields(info, { keep: ["id"], exclude: ["medias"] })

    const findAll = async (info, args) => {
        const fields = getFields(info)
        const options = { attributes: fields, order: ['id'] }
        if (args.start != null && args.max != null) {
            options.offset = args.start;
            options.limit = args.max;
        }
        const members = await Member.findAll(options)
        return members;
    }

    const findById = async (info, args) => {
        const fields = getFields(info)
        const member = await Member.findOne({ where: { id: args.id }, attributes: fields })
        return member;
    }

    const create = async args => {
        const member = await Member.create(args.input)
        await member.reload()
        return member;
    }

    const destroy = async args => {
        const deleted = await Member.destroy({ where: { id: args.id } })
        return deleted > 0
    }

    const update = async args => {
        const f = await Member.findByPk(args.id, { attributes: ["id"], raw: true })

        if (!f) {
            throw new Error(`Member with id: ${args.id} not found`)
        }

        const [members, meta] = await Member.update(args.input, { where: { id: args.id }, returning: true })       

        const member = await Member.findOne({ where: { id: args.id } })

        return member;
    }

    const findAllPaginated = async (info, args) => {           
        
        const fields = getFieldsWithSubfields(info).get("rows")              
        
        const totalRows = await Member.count()

        const paginator = new Paginator(args.limit, args.page, totalRows);

        const totalPages = paginator.getTotalPages();

		const start = paginator.getStart();

		const end = paginator.getEnd();		

        const options = { attributes: fields, order: ['id'] }
        options.offset = start - 1;
        options.limit = args.limit;

        const members = await Member.findAll(options)

        const paginatedList = new PaginatedList(members, start, end, totalPages, paginator.getCurrentPage(), paginator.getLimitRows(), paginator.getMaxRows())
        return paginatedList;
    }

    return { findAll, findById, create, destroy, update, findAllPaginated }
}

export default membersRepository;