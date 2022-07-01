const { QueryTypes } = require('sequelize');
import { RequestedFields } from '../../../RequestedFields';
import { Comment } from '../../../models';
import Paginator from '../../../utils/Paginator';
import PaginatedList from '../../../utils/PaginatedList';

const commentsRepository = db => {
    const requestedFields = new RequestedFields();
    const getFields = info => requestedFields.getFields(info, { keep: [], exclude: ["blog"] })
    const getFieldsWithSubfields = info => requestedFields.getFieldsWithSubfields(info, { keep: [], exclude: ["blog"] })

    const findAll = async (info, args) => {
        const fields = getFields(info)
        const options = { attributes: fields, order: ['id'] }
        if (args.start != null && args.max != null) {
            options.offset = args.start;
            options.limit = args.max;
        }
        const comments = await Comment.findAll(options)
        return comments;
    }

    const findById = async (info, args) => {
        const fields = getFields(info)
        const comment = await Comment.findOne({ where: { id: args.id }, attributes: fields })
        return comment;
    }

    const create = async args => {
        const comment = await Comment.create(args.input)
        await comment.reload()
        return comment;
    }

    const destroy = async args => {
        const deleted = await Comment.destroy({ where: { id: args.id } })
        return deleted > 0
    }

    const update = async args => {
        const [comments, meta] = await Comment.update(args.input, { where: { id: args.id }, returning: true })

        if (meta == 0) {
            throw new Error(`Comment with id: ${args.id} not found`)
        }

        const comment = await Comment.findOne({ where: { id: args.id } })

        return comment;
    }

    const findAllPaginated = async (info, args) => {           
        
        const fields = getFieldsWithSubfields(info).get("rows")              
        
        const totalRows = await Comment.count()

        const paginator = new Paginator(args.limit, args.page, totalRows);

        const totalPages = paginator.getTotalPages();

		const start = paginator.getStart();

		const end = paginator.getEnd();		

        const options = { attributes: fields, order: ['id'] }
        options.offset = start - 1;
        options.limit = args.limit;

        const comments = await Comment.findAll(options)

        const paginatedList = new PaginatedList(comments, start, end, totalPages, paginator.getCurrentPage(), paginator.getLimitRows(), paginator.getMaxRows())
        return paginatedList;
    }

    return { findAll, findById, create, destroy, update, findAllPaginated }
}

export default commentsRepository;