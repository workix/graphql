const { QueryTypes } = require('sequelize');
import { RequestedFields } from '../../../RequestedFields';
import { Blog, Comment } from '../../../models';
import Paginator from '../../../utils/Paginator';
import PaginatedList from '../../../utils/PaginatedList';

const commentsRepository = db => {
    const requestedFields = new RequestedFields();
    const getFields = info => requestedFields.getFields(info, { keep: [], exclude: ["blog"] })
    const getFieldsWithSubfields = info => requestedFields.getFieldsWithSubfields(info, { keep: [], exclude: ["blog"] })

    const findAllRecents = async (info, args) => {
        const fields = getFields(info)
        const options = { attributes: fields, order: [['createdAt', 'DESC']] }
        if (args.start != null && args.max != null) {
            options.offset = args.start;
            options.limit = args.max;
        }
        const comments = await Comment.findAll(options)
        return comments;
    }

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
        let comment;
        await db.sequelize.transaction(async transaction => {
            comment = await Comment.create(args.input, { transaction })

            if (!args.input.blog_id) {
                throw new Error("blog_id is not provided")
            }

            const blog = await Blog.findOne({ where: { id: args.input.blog_id } }, { transaction })


            if (!blog) {
                throw new Error(`Blog with id: ${args.input.blog_id} not found`)
            }
            await blog.addComment(comment, { transaction })
            await comment.reload({ transaction })
        });

        return comment;
    }

    const destroy = async args => {
        let deleted = false;
        await db.sequelize.transaction(async transaction => {
            const blog = await Blog.findOne({ where: { id: args.blog_id } }, { transaction })
            
            if (!blog) {
                throw new Error(`Blog with id: ${args.input.blog_id} not found`)
            }
            
            const comment = await Comment.findOne({ where: { id: args.id } }, { transaction })
            
            if (!comment) {
                throw new Error(`Comment with id: ${args.id} not found`)
            }

            await blog.removeComment(comment, { transaction })
            await comment.destroy({ transaction })
            deleted = true
        })

        return deleted
    }

    const update = async args => {
        const c = await Comment.findByPk(args.id, { attributes: ["id"], raw: true })

        if (!c) {
            throw new Error(`Comment with id: ${args.id} not found`)
        }

        const [comments, meta] = await Comment.update(args.input, { where: { id: args.id }, returning: true })        

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

    return { findAll, findById, create, destroy, update, findAllPaginated, findAllRecents }
}

export default commentsRepository;