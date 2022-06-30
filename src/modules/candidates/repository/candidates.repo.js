const { QueryTypes } = require('sequelize');
import { RequestedFields } from '../../../RequestedFields';
import { Candidate } from '../../../models';
import Paginator from '../../../utils/Paginator';
import PaginatedList from '../../../utils/PaginatedList';

const candidatesRepository = db => {
    const requestedFields = new RequestedFields();
    const getFields = info => requestedFields.getFields(info, { keep: ["id", "user_id"], exclude: ["user"] })
    const getFieldsWithSubfields = info => requestedFields.getFieldsWithSubfields(info, { keep: ["id", "user_id"], exclude: ["user"] })

    const findAll = async (info, args) => {
        const fields = getFields(info)
        const options = { attributes: fields, order: ['id'] }
        if (args.start != null && args.max != null) {
            options.offset = args.start;
            options.limit = args.max;
        }
        const candidates = await Candidate.findAll(options)
        return candidates;
    }

    const findById = async (info, args) => {
        const fields = getFields(info)
        const candidate = await Candidate.findOne({ where: { id: args.id }, attributes: fields })
        return candidate;
    }

    const create = async args => {
        try {
            const candidate = await Candidate.create(args.input)
            await candidate.reload()
            return candidate;    
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
        const deleted = await Candidate.destroy({ where: { id: args.id } })
        return deleted > 0
    }

    const update = async args => {
        const [candidates, meta] = await Candidate.update(args.input, { where: { id: args.id }, returning: true })

        if (meta == 0) {
            throw new Error(`Candidate with id: ${args.id} not found`)
        }

        const candidate = await Candidate.findOne({ where: { id: args.id } })

        return candidate;
    }

    const findAllPaginated = async (info, args) => {           
        
        const fields = getFieldsWithSubfields(info).get("rows")    
        fields.push("user_id")                  
        
        const totalRows = await Candidate.count()

        const paginator = new Paginator(args.limit, args.page, totalRows);

        const totalPages = paginator.getTotalPages();

		const start = paginator.getStart();

		const end = paginator.getEnd();		

        const options = { attributes: fields, order: ['id'] }
        options.offset = start - 1;
        options.limit = args.limit;

        const candidates = await Candidate.findAll(options)

        const paginatedList = new PaginatedList(candidates, start, end, totalPages, paginator.getCurrentPage(), paginator.getLimitRows(), paginator.getMaxRows())
        return paginatedList;
    }

    return { findAll, findById, create, destroy, update, findAllPaginated }
}

export default candidatesRepository;