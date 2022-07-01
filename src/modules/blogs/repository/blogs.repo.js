const { QueryTypes } = require('sequelize');
import { RequestedFields } from '../../../RequestedFields';
import { Blog } from '../../../models';
import Paginator from '../../../utils/Paginator';
import PaginatedList from '../../../utils/PaginatedList';

const blogsRepository = db => {
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
        const blogs = await Blog.findAll(options)
        return blogs;
    }

    const findById = async (info, args) => {
        const fields = getFields(info)
        const blog = await Blog.findOne({ where: { id: args.id }, attributes: fields })
        return blog;
    }

    const create = async args => {
        const blog = await Blog.create(args.input)
        await blog.reload()
        return blog;
    }

    const destroy = async args => {
        const deleted = await Blog.destroy({ where: { id: args.id } })
        return deleted > 0
    }

    const update = async args => {
        const [blogs, meta] = await Blog.update(args.input, { where: { id: args.id }, returning: true })

        if (meta == 0) {
            throw new Error(`Blog with id: ${args.id} not found`)
        }

        const blog = await Blog.findOne({ where: { id: args.id } })

        return blog;
    }

    const findAllPaginated = async (info, args) => {           
        
        const fields = getFieldsWithSubfields(info).get("rows")              
        
        const totalRows = await Blog.count()

        const paginator = new Paginator(args.limit, args.page, totalRows);

        const totalPages = paginator.getTotalPages();

		const start = paginator.getStart();

		const end = paginator.getEnd();		

        const options = { attributes: fields, order: ['id'] }
        options.offset = start - 1;
        options.limit = args.limit;

        const blogs = await Blog.findAll(options)

        const paginatedList = new PaginatedList(blogs, start, end, totalPages, paginator.getCurrentPage(), paginator.getLimitRows(), paginator.getMaxRows())
        return paginatedList;
    }

    return { findAll, findById, create, destroy, update, findAllPaginated }
}

export default blogsRepository;