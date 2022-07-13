import { RequestedFields } from '../../../RequestedFields';
import { Blog, Comment, BlogPicture, BlogTag, BlogComment } from '../../../models';
import Paginator from '../../../utils/Paginator';
import PaginatedList from '../../../utils/PaginatedList';

const Sequelize = require('sequelize');

const blogsRepository = db => {
    const requestedFields = new RequestedFields();
    const getFields = info => requestedFields.getFields(info, { keep: ["author_id"], exclude: ["author", "comments", "pictures", "tags", "blog"] })
    const getFieldsWithSubfields = info => requestedFields.getFieldsWithSubfields(info, { keep: ["author_id"], exclude: ["author", "comments", "pictures", "tags", "blog"] })

    const findAllCategories = async (info, args) => {
        const categories = await Blog.findAll({
            attributes: [Sequelize.fn('DISTINCT', Sequelize.col('category')) ,'category'],            
            raw: true
        })        
        return categories.map(c => c.category);
    }

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
        const blog = await Blog.create(args.input, { include: [{ model: Comment, as: "comments" }, { model: BlogPicture, as: "pictures" },{ model: BlogTag, as: "tags" }]})
        await blog.reload()
        return blog;
    }

    const destroy = async args => {
        const deleted = await Blog.destroy({ where: { id: args.id } })
        return deleted > 0
    }

    const update = async args => {
        const b = await Blog.findByPk(args.id, { attributes: ["id"], raw: true })

        if (!b) {
            throw new Error(`Blog with id: ${args.id} not found`)
        }

        let blog;

        await db.sequelize.transaction(async transaction => {
            // chain all your queries here. make sure you return them.
            const [blogs, meta] = await Blog.update(args.input, { where: { id: args.id }, returning: true }, { transaction })       

            blog = await Blog.findOne({ where: { id: args.id }, include: [{ model: Comment, as: "comments" }, { model: BlogPicture, as: "pictures" },{ model: BlogTag, as: "tags" }]})

            await BlogComment.destroy({ where: { Blog_id: args.id } }, { transaction })
            

            let comment;
            for (const c of args.input.comments) {
                comment = await Comment.create({ email: c.email, name: c.name, text: c.text }, { transaction })
                await blog.addComment(comment, { transaction })
            }

            await BlogTag.destroy({ where: { id: args.id } }, { transaction })
    
            for (const t of args.input.tags) {
                await BlogTag.create({ id: args.id, name: t.name }, { transaction })
            }

            await BlogPicture.destroy({ where: { id: args.id } }, { transaction })
    
            for (const p of args.input.pictures) {
                await BlogPicture.create({ id: args.id, pictures: p.pictures }, { transaction })
            }
        })             

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

    return { findAll, findById, create, destroy, update, findAllPaginated, findAllCategories }
}

export default blogsRepository;