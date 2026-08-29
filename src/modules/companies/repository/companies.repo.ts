const { QueryTypes, Sequelize } = require('sequelize');
import { RequestedFields } from '../../../RequestedFields';
import { Company, CompanyMedia } from '../../../models';
import Paginator from '../../../utils/Paginator';
import PaginatedList from '../../../utils/PaginatedList';
import CompanyDTO from '../../../dtos/CompanyDTO';
import { CreateCompanyDTO, UpdateCompanyDTO } from '../../../dtos/CompanyMutationDTO'
import { CreateMediaDTO } from '../../../dtos/MediaMutationDTO';

const companiesRepository = db => {
    const requestedFields = new RequestedFields();
    const getFields = info => requestedFields.getFields(info, { keep: ["id", "user_id"], exclude: ["user", "medias"] })
    const getFieldsWithSubfields = info => requestedFields.getFieldsWithSubfields(info, { keep: ["id", "user_id"], exclude: ["user", "medias"] })

    const listRandomLogos = async (info, args) => {
        const fields = getFields(info)
        const options: any = { attributes: fields, order: [Sequelize.fn('RAND')] }
        if (args.start != null && args.max != null) {
            options.offset = args.start;
            options.limit = args.max;
        }
        const logos = await Company.findAll(options)
        return logos;
    }

    const findAll = async (info, args) => {
        const fields = getFields(info)
        const options: any = { attributes: fields, order: ['id'] }
        if (args.start != null && args.max != null) {
            options.offset = args.start;
            options.limit = args.max;
        }
        const companies = await Company.findAll(options)
        return companies;
    }

    const findById = async (info, args) => {
        const fields = getFields(info)
        const company = await Company.findOne({ where: { id: args.id }, attributes: fields })
        return company;
    }

    const create = async args => {
        try {
            const options: any = args.input.medias ? { include: { model: CompanyMedia, as: "medias" } } : {}
            const company = await Company.create(new CreateCompanyDTO(args.input), options)
            await company.reload()
            return company;
        } catch (error) {
            console.error(error)
            if (error.errors) {
                const errors = error.errors.map(e => e.message)
                throw new Error(errors.toString())
            } else {
                throw new Error(error.message)
            }

        }

    }

    const destroy = async args => {
        const deleted = await Company.destroy({ where: { id: args.id } })
        return deleted > 0
    }

    const update = async args => {
        const c = await Company.findByPk(args.id, { attributes: ["id"], raw: true })

        if (!c) {
            throw new Error(`Company with id: ${args.id} not found`)
        }

        await db.sequelize.transaction(async transaction => {
            // chain all your queries here. make sure you return them.
            const [companies, meta] = await Company.update(new UpdateCompanyDTO(args.input), { where: { id: args.id }, returning: true, individualHooks: true }, { transaction })

            if (args.input.medias) {
                for (const m of args.input.medias) {
                    await CompanyMedia.destroy({ where: { id: args.id } }, { transaction })
                    const mediaInput = { id: args.id, media: m.media, url: m.url }
                    await CompanyMedia.create(new CreateMediaDTO(mediaInput), { transaction })
                }
            }
        })

        const company = await Company.findOne({ where: { id: args.id }, include: { model: CompanyMedia, as: "medias" } })

        return company;
    }

    const findAllPaginated = async (info, args) => {

        const fields = getFieldsWithSubfields(info).get("companies")
        fields.push("user_id")

        const totalRows = await Company.count()

        const paginator = new Paginator(args.limit, args.page, totalRows);

        const totalPages = paginator.getTotalPages();

        const start = paginator.getStart();

        const end = paginator.getEnd();

        const options: any = { attributes: fields, order: ['id'] }
        options.offset = start - 1;
        options.limit = args.limit;

        let companies = await Company.findAll(options)
        companies = companies.map(c => new CompanyDTO(c))

        const paginatedList = new PaginatedList('companies', companies, start, end, totalPages, paginator.getCurrentPage(), paginator.getLimitRows(), paginator.getMaxRows())
        return paginatedList;
    }

    return { findAll, findById, create, destroy, update, findAllPaginated, listRandomLogos }
}

export default companiesRepository;
