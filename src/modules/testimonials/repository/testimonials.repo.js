const { QueryTypes } = require('sequelize');
import { RequestedFields } from '../../../RequestedFields';
import { Testimonial } from '../../../models';
import Paginator from '../../../utils/Paginator';
import PaginatedList from '../../../utils/PaginatedList';

const testimonialsRepository = db => {
    const requestedFields = new RequestedFields();
    const getFields = info => requestedFields.getFields(info, { keep: ["author_id"], exclude: ["author"] })
    const getFieldsWithSubfields = info => requestedFields.getFieldsWithSubfields(info, { keep: ["author_id"], exclude: ["author"] })

    const findAll = async (info, args) => {
        const fields = getFields(info)
        const options = { attributes: fields, order: ['id'] }
        if (args.start != null && args.max != null) {
            options.offset = args.start;
            options.limit = args.max;
        }
        const testimonials = await Testimonial.findAll(options)
        return testimonials;
    }

    const findById = async (info, args) => {
        const fields = getFields(info)
        const testimonial = await Testimonial.findOne({ where: { id: args.id }, attributes: fields })
        return testimonial;
    }

    const create = async args => {
        const testimonial = await Testimonial.create(args.input)
        await testimonial.reload()
        return testimonial;
    }

    const destroy = async args => {
        const deleted = await Testimonial.destroy({ where: { id: args.id } })
        return deleted > 0
    }

    const update = async args => {
        const f = await Testimonial.findByPk(args.id, { attributes: ["id"], raw: true })

        if (!f) {
            throw new Error(`Testimonial with id: ${args.id} not found`)
        }

        const [testimonials, meta] = await Testimonial.update(args.input, { where: { id: args.id }, returning: true })       

        const testimonial = await Testimonial.findOne({ where: { id: args.id } })

        return testimonial;
    }

    const findAllPaginated = async (info, args) => {           
        
        const fields = getFieldsWithSubfields(info).get("rows")
        fields.push("author_id")              
        
        const totalRows = await Testimonial.count()

        const paginator = new Paginator(args.limit, args.page, totalRows);

        const totalPages = paginator.getTotalPages();

		const start = paginator.getStart();

		const end = paginator.getEnd();		

        const options = { attributes: fields, order: ['id'] }
        options.offset = start - 1;
        options.limit = args.limit;

        const testimonials = await Testimonial.findAll(options)

        const paginatedList = new PaginatedList('testimonials', testimonials, start, end, totalPages, paginator.getCurrentPage(), paginator.getLimitRows(), paginator.getMaxRows())
        return paginatedList;
    }

    return { findAll, findById, create, destroy, update, findAllPaginated }
}

export default testimonialsRepository;