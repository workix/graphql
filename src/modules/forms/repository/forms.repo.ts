const { QueryTypes } = require('sequelize');
import { RequestedFields } from '../../../RequestedFields';
import { Form } from '../../../models';
import Paginator from '../../../utils/Paginator';
import PaginatedList from '../../../utils/PaginatedList';
import FormDTO from '../../../dtos/FormDTO';
import { CreateFormDTO, UpdateFormDTO } from '../../../dtos/FormMutationDTO';

const formsRepository = db => {
    const requestedFields = new RequestedFields();
    const getFields = info => requestedFields.getFields(info, { keep: ["id"], exclude: [] })
    const getFieldsWithSubfields = info => requestedFields.getFieldsWithSubfields(info, { keep: ["id"], exclude: [] })

    const findAll = async (info, args) => {
        const fields = getFields(info)
        const options: any = { attributes: fields, order: ['id'] }
        if (args.start != null && args.max != null) {
            options.offset = args.start;
            options.limit = args.max;
        }
        const forms = await Form.findAll(options)
        return forms;
    }

    const findById = async (info, args) => {
        const fields = getFields(info)
        const form = await Form.findOne({ where: { id: args.id }, attributes: fields })
        return form;
    }

    const create = async args => {
        const form = await Form.create(new CreateFormDTO(args.input))
        await form.reload()
        return form;
    }

    const destroy = async args => {
        const deleted = await Form.destroy({ where: { id: args.id } })
        return deleted > 0
    }

    const update = async args => {
        const f = await Form.findByPk(args.id, { attributes: ["id"], raw: true })

        if (!f) {
            throw new Error(`Form with id: ${args.id} not found`)
        }

        const [forms, meta] = await Form.update(new UpdateFormDTO(args.input), { where: { id: args.id }, returning: true, individualHooks: true })       

        const form = await Form.findOne({ where: { id: args.id } })

        return form;
    }

    const findAllPaginated = async (info, args) => {           
        
        const fields = getFieldsWithSubfields(info).get("forms")              
        
        const totalRows = await Form.count()

        const paginator = new Paginator(args.limit, args.page, totalRows);

        const totalPages = paginator.getTotalPages();

		const start = paginator.getStart();

		const end = paginator.getEnd();		

        const options: any = { attributes: fields, order: ['id'] }
        options.offset = start - 1;
        options.limit = args.limit;

        let forms = await Form.findAll(options)
        forms = forms.map(f => new FormDTO(f))

        const paginatedList = new PaginatedList('forms', forms, start, end, totalPages, paginator.getCurrentPage(), paginator.getLimitRows(), paginator.getMaxRows())
        return paginatedList;
    }

    return { findAll, findById, create, destroy, update, findAllPaginated }
}

export default formsRepository;
