import { RequestedFields } from '../../../RequestedFields';
import { Blog, Comment, BlogPicture, BlogTag, BlogComment, BlogCategory } from '../../../models';
import Paginator from '../../../utils/Paginator';
import PaginatedList from '../../../utils/PaginatedList';
import BlogDTO from '../../../dtos/BlogDTO';
import { CreateBlogDTO, UpdateBlogDTO } from '../../../dtos/BlogMutationDTO'
import { CreateCommentDTO } from '../../../dtos/CommentMutationDTO';
import { CreateTagDTO } from '../../../dtos/TagMutationDTO';
import { CreatePictureDTO } from '../../../dtos/PictureMutationDTO';
import { CreateCategoryDTO } from '../../../dtos/CategoryMutationDTO';

const { Sequelize, QueryTypes } = require('sequelize');

const blogsRepository = db => {
    const requestedFields = new RequestedFields();
    const getFields = info => requestedFields.getFields(info, { keep: ["author_id"], exclude: ["author", "comments", "pictures", "tags", "blog", "categories"] })
    const getFieldsWithSubfields = info => requestedFields.getFieldsWithSubfields(info, { keep: ["author_id"], exclude: ["author", "comments", "pictures", "tags", "blog", "categories"] })

    const findAllCategories = async (info, args) => {
        const categories = await BlogCategory.findAll({
            attributes: [Sequelize.fn('DISTINCT', Sequelize.col('category')), 'category'],
            raw: true
        })
        return categories.map(c => c.category);
    }

    const findAllTimePeriods = async (info, args) => {
        const timePeriods = await db.sequelize.query(`SELECT EXTRACT(YEAR FROM (b.created_at)) as year, EXTRACT(MONTH FROM (b.created_at)) as month from blogs b GROUP BY EXTRACT(YEAR FROM (b.created_at)), EXTRACT(MONTH FROM (b.created_at))`, {
            type: QueryTypes.SELECT
        })
        return timePeriods;
    }

    const findAllRecents = async (info, args) => {
        const fields = getFields(info)
        const options = { attributes: fields, order: [['created_at', 'DESC']] }
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
        const options = { include: [] }
        if (args.input.comments) {
            options.include.push({ model: Comment, as: "comments" })
        }
        if (args.input.pictures) {
            options.include.push({ model: BlogPicture, as: "pictures" })
        }
        if (args.input.tags) {
            options.include.push({ model: BlogTag, as: "tags" })
        }
        if (args.input.categories) {
            options.include.push({ model: BlogCategory, as: "categories" })
        }
        await db.sequelize.transaction(async transaction => {
            blog = await Blog.create(new CreateBlogDTO(args.input), options, { transaction })
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

            if (args.input.comments) {
                let comment;
                for (const c of args.input.comments) {
                    await BlogComment.destroy({ where: { blog_id: args.id } }, { transaction })
                    const commentInput = { email: c.email, name: c.name, text: c.text, parentId: c.parentId }
                    comment = await Comment.create(new CreateCommentDTO(commentInput), { transaction })
                    await blog.addComment(comment, { transaction })
                }
            }

            if (args.input.tags) {
                await BlogTag.destroy({ where: { id: args.id } }, { transaction })

                for (const t of args.input.tags) {
                    const tagInput = { id: args.id, name: t.name }
                    await BlogTag.create(new CreateTagDTO(tagInput), { transaction })
                }
            }

            if (args.input.pictures) {
                await BlogPicture.destroy({ where: { id: args.id } }, { transaction })

                for (const p of args.input.pictures) {
                    const pictureInput = { id: args.id, picture: p.picture }
                    await BlogPicture.create(new CreatePictureDTO(pictureInput), { transaction })
                }
            }

            if (args.input.categories) {
                await BlogCategory.destroy({ where: { id: args.id } }, { transaction })

                for (const c of args.input.categories) {
                    const categoryInput = { id: args.id, category: c.category }
                    await BlogCategory.create(new CreateCategoryDTO(categoryInput), { transaction })
                }
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