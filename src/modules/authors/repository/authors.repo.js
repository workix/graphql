import { sequelize } from "../../../models";
import { RequestedFields } from '../../../RequestedFields';
import { Author, AuthorMedia } from '../../../models';
import Paginator from '../../../utils/Paginator';
import PaginatedList from '../../../utils/PaginatedList';

const authorsRepository = db => {
    const requestedFields = new RequestedFields();
    const getFields = info => requestedFields.getFields(info, { keep: ["id"], exclude: ["medias", "author"] })
    const getFieldsWithSubfields = info => requestedFields.getFieldsWithSubfields(info, { keep: ["id"], exclude: ["medias", "author"] })

    const findAll = async (info, args) => {
        const fields = getFields(info)
        const options = { attributes: fields, order: ['id'] }
        if (args.start != null && args.max != null) {
            options.offset = args.start;
            options.limit = args.max;
        }
        const authors = await Author.findAll(options)
        return authors;
    }

    const findById = async (info, args) => {
        const fields = getFields(info)
        const author = await Author.findOne({ where: { id: args.id }, attributes: fields })
        return author;
    }

    const create = async args => {
        const author = await Author.create(args.input, { include: { model: AuthorMedia, as: "medias" } })
        await author.reload()
        return author;
    }

    const destroy = async args => {
        const deleted = await Author.destroy({ where: { id: args.id } })
        return deleted > 0
    }

    const update = async args => {
        const a = await Author.findByPk(args.id, { attributes: ["id"], raw: true })

        if (!a) {
            throw new Error(`Author with id: ${args.id} not found`)
        }

        await sequelize.transaction(async transaction => {
            // chain all your queries here. make sure you return them.
            const [authors, meta] = await Author.update(args.input, { where: { id: args.id }, returning: true }, { transaction })       

            await AuthorMedia.destroy({ where: { id: args.id } }, { transaction })
    
            for (const m of args.input.medias) {
                await AuthorMedia.create({ id: args.id, media: m.media, url: m.url }, { transaction })
            }
        })     

        const author = await Author.findOne({ where: { id: args.id }, include: { model: AuthorMedia, as: "medias" } })

        return author;
    }

    const findAllPaginated = async (info, args) => {

        const fields = getFieldsWithSubfields(info).get("rows")

        const totalRows = await Author.count()

        const paginator = new Paginator(args.limit, args.page, totalRows);

        const totalPages = paginator.getTotalPages();

        const start = paginator.getStart();

        const end = paginator.getEnd();

        const options = { attributes: fields, order: ['id'] }
        options.offset = start - 1;
        options.limit = args.limit;

        const authors = await Author.findAll(options)

        const paginatedList = new PaginatedList(authors, start, end, totalPages, paginator.getCurrentPage(), paginator.getLimitRows(), paginator.getMaxRows())
        return paginatedList;
    }

    return { findAll, findById, create, destroy, update, findAllPaginated }
}

export default authorsRepository;