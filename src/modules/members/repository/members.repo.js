const { QueryTypes } = require('sequelize');
import { RequestedFields } from '../../../RequestedFields';
import { Member,MemberMedia } from '../../../models';
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
        const member = await Member.create(args.input,{ include: { model: MemberMedia, as: "medias" } })
        await member.reload()
        return member;
    }

    const destroy = async args => {
        const deleted = await Member.destroy({ where: { id: args.id } })
        return deleted > 0
    }

    const update = async args => {
        const m = await Member.findByPk(args.id, { attributes: ["id"], raw: true })

        if (!m) {
            throw new Error(`Member with id: ${args.id} not found`)
        }

        await db.sequelize.transaction(async transaction => {
            // chain all your queries here. make sure you return them.
            const [members, meta] = await Member.update(args.input, { where: { id: args.id }, returning: true }, { transaction })       

            await MemberMedia.destroy({ where: { id: args.id } }, { transaction })
    
            for (const m of args.input.medias) {
                await MemberMedia.create({ id: args.id, media: m.media, url: m.url }, { transaction })
            }
        })     

        const member = await Member.findOne({ where: { id: args.id }, include: { model: MemberMedia, as: "medias" } })

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