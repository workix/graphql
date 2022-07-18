import { RequestedFields } from '../../../RequestedFields';
import { Blog, Comment, BlogPicture, BlogTag, BlogComment, BlogCategory } from '../../../models';
import Paginator from '../../../utils/Paginator';
import PaginatedList from '../../../utils/PaginatedList';
import BlogDTO from '../../../dtos/BlogDTO';
import { CreateBlogDTO, UpdateBlogDTO } from '../../../dtos/BlogMutationDTO'

const { Sequelize, QueryTypes } = require('sequelize');

const blogsRepository = db => {
    const requestedFields = new RequestedFields();
    const getFields = info => requestedFields.getFields(info, { keep: ["author_id"], exclude: ["author", "comments", "pictures", "tags", "blog", "categories"] })
    const getFieldsWithSubfields = info => requestedFields.getFieldsWithSubfields(info, { keep: ["author_id"], exclude: ["author", "comments", "pictures", "tags", "blog", "categories"] })

    const findAllCategories = async (info, args) => {
        const categories = await Blog.findAll({
            attributes: [Sequelize.fn('DISTINCT', Sequelize.col('category')), 'category'],
            raw: true
        })
        return categories.map(c => c.category);
    }

    const findAllTimePeriods = async (info, args) => {
        const timePeriods = await db.sequelize.query(`SELECT YEAR(b.createdAt) as year, MONTH(b.createdAt) as month from blogs b GROUP BY YEAR(b.createdAt), MONTH(b.createdAt)`, {
            type: QueryTypes.SELECT
        })
        return timePeriods;
    }

    const findAllRecents = async (info, args) => {
        const fields = getFields(info)
        const options = { attributes: fields, order: [['createdAt', 'DESC']] }
        if (args.start != null && args.max != null) {
            options.offset = args.start;
            options.limit = args.max;
        }
        const blogs = await Blog.findAll(options)
        return blogs;
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
        let blog;
        await db.sequelize.transaction(async transaction => {
            blog = await Blog.create(new CreateBlogDTO(args.input), { include: [{ model: Comment, as: "comments" }, { model: BlogPicture, as: "pictures" }, { model: BlogTag, as: "tags" }, { model: BlogCategory, as: "categories" },] }, { transaction })
            await blog.reload()
            
        })  
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
            const [blogs, meta] = await Blog.update(new UpdateBlogDTO(args.input), { where: { id: args.id }, returning: true, individualHooks: true }, { transaction })

            blog = await Blog.findOne({ where: { id: args.id }, include: [{ model: Comment, as: "comments" }, { model: BlogPicture, as: "pictures" }, { model: BlogTag, as: "tags" }, { model: BlogCategory, as: "categories" },] })

            await BlogComment.destroy({ where: { blog_id: args.id } }, { transaction })


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
                await BlogPicture.create({ id: args.id, picture: p.picture }, { transaction })
            }

            await BlogCategory.destroy({ where: { id: args.id } }, { transaction })

            for (const c of args.input.categories) {
                await BlogCategory.create({ id: args.id, category: c.category }, { transaction })
            }
        })

        return blog;
    }

    const findAllPaginated = async (info, args) => {

        const fields = getFieldsWithSubfields(info).get("blogs")

        const totalRows = await Blog.count()

        const paginator = new Paginator(args.limit, args.page, totalRows);

        const totalPages = paginator.getTotalPages();

        const start = paginator.getStart();

        const end = paginator.getEnd();

        const options = { attributes: fields, order: ['id'] }
        options.offset = start - 1;
        options.limit = args.limit;

        let blogs = await Blog.findAll(options)
        blogs = blogs.map(b => new BlogDTO(b))

        const paginatedList = new PaginatedList(blogs, start, end, totalPages, paginator.getCurrentPage(), paginator.getLimitRows(), paginator.getMaxRows())
        return paginatedList;
    }

    return { findAll, findById, create, destroy, update, findAllPaginated, findAllCategories, findAllTimePeriods, findAllRecents }
}

export default blogsRepository;