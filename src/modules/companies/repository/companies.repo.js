const { QueryTypes } = require('sequelize');
import { RequestedFields } from '../../../RequestedFields';
import { Company, CompanyMedia } from '../../../models';
import Paginator from '../../../utils/Paginator';
import PaginatedList from '../../../utils/PaginatedList';

const companiesRepository = db => {
    const requestedFields = new RequestedFields();
    const getFields = info => requestedFields.getFields(info, { keep: ["id", "user_id"], exclude: ["user", "medias"] })
    const getFieldsWithSubfields = info => requestedFields.getFieldsWithSubfields(info, { keep: ["id", "user_id"], exclude: ["user","medias"] })

    const findAll = async (info, args) => {
        const fields = getFields(info)
        const options = { attributes: fields, order: ['id'] }
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
            const company = await Company.create(args.input, { include: { model: CompanyMedia, as: "medias" } })
            await company.reload()
            return company;    
        } catch (error) {
            console.error(error)
            if (error.errors){
                const errors = error.errors.map(e => e.message)                
                throw new Error(errors.toString())
            }else {                
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
            const [companies, meta] = await Company.update(args.input, { where: { id: args.id }, returning: true }, { transaction })       

            await CompanyMedia.destroy({ where: { id: args.id } }, { transaction })
    
            for (const m of args.input.medias) {
                await CompanyMedia.create({ id: args.id, media: m.media, url: m.url }, { transaction })
            }
        })     

        const company = await Company.findOne({ where: { id: args.id }, include: { model: CompanyMedia, as: "medias" } })

        return company;
    }

    const findAllPaginated = async (info, args) => {           
        
        const fields = getFieldsWithSubfields(info).get("rows")    
        fields.push("user_id")                  
        
        const totalRows = await Company.count()

        const paginator = new Paginator(args.limit, args.page, totalRows);

        const totalPages = paginator.getTotalPages();

		const start = paginator.getStart();

		const end = paginator.getEnd();		

        const options = { attributes: fields, order: ['id'] }
        options.offset = start - 1;
        options.limit = args.limit;

        const companies = await Company.findAll(options)

        const paginatedList = new PaginatedList(companies, start, end, totalPages, paginator.getCurrentPage(), paginator.getLimitRows(), paginator.getMaxRows())
        return paginatedList;
    }

    return { findAll, findById, create, destroy, update, findAllPaginated }
}

export default companiesRepository;