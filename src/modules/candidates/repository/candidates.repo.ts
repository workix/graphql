const { QueryTypes } = require('sequelize');
import { RequestedFields } from '../../../RequestedFields';
import { Candidate } from '../../../models';
import Paginator from '../../../utils/Paginator';
import PaginatedList from '../../../utils/PaginatedList';
import CandidateDTO from '../../../dtos/CandidateDTO';
import { CreateCandidateDTO, UpdateCandidateDTO } from '../../../dtos/CandidateMutationDTO';
import _ from 'lodash';

const candidatesRepository = (db: any) => {
    const requestedFields = new RequestedFields();
    const getFields = (info: any) => requestedFields.getFields(info, { keep: ["id", "user_id"], exclude: ["user", "resume", 'locale', 'contact'] })
    const getFieldsWithSubfields = (info: any) => requestedFields.getFieldsWithSubfields(info, { keep: ["id", "user_id"], exclude: ["user", "resume", 'locale', 'contact'] })

    const findAll = async (info: any, args: any) => {
        let fields = getFields(info)
        const subFields = _.concat(getFieldsWithSubfields(info).get('locale'), getFieldsWithSubfields(info).get('contact'))
        fields = _.compact(_.concat(fields, ...subFields))       
             
        const options: any = { attributes: fields, order: ['id'] }
        if (args.start != null && args.max != null) {
            options.offset = args.start;
            options.limit = args.max;
        }
        const candidates = await Candidate.findAll(options)
        
        return candidates;
    }

    const findById = async (info: any, args: any) => {
        let fields = getFields(info)
        const subFields = _.concat(getFieldsWithSubfields(info).get('locale'), getFieldsWithSubfields(info).get('contact'))
        fields = _.compact(_.concat(fields, ...subFields))       
        const candidate = await Candidate.findOne({ where: { id: args.id }, attributes: fields })
        return candidate;
    }

    const findByUserId = async (info: any, args: any) => {
        let fields = getFields(info)
        const subFields = _.concat(getFieldsWithSubfields(info).get('locale'), getFieldsWithSubfields(info).get('contact'))
        fields = _.compact(_.concat(fields, ...subFields))   
        const candidate = await Candidate.findOne({ where: { user_id: args.userId }, attributes: fields })
        return candidate;
    }

    const create = async (args: any) => {
        try {
            const candidate = await Candidate.create(new CreateCandidateDTO(args.input) as any)
            await candidate.reload()
            return candidate;    
        } catch (error: any) {
            console.error(error)
            if (error.errors){
                const errors = error.errors.map((e: any) => e.message)                
                throw new Error(errors.toString())
            } else {                
                throw new Error(error.message)
            }
        }
    }

    const destroy = async (args: any) => {
        const deleted = await Candidate.destroy({ where: { id: args.id } })
        return deleted > 0
    }

    const update = async (args: any) => {
        const c = await Candidate.findByPk(args.id, { attributes: ["id"], raw: true })

        if (!c) {
            throw new Error(`Candidate with id: ${args.id} not found`)
        }

        const [candidates, meta] = await Candidate.update(new UpdateCandidateDTO(args.input) as any, { where: { id: args.id }, returning: true, individualHooks: true })        

        const candidate = await Candidate.findOne({ where: { id: args.id } })

        return candidate;
    }

    const findAllPaginated = async (info: any, args: any) => {                   
        const fields = getFieldsWithSubfields(info).get("candidates")    
        fields.push("user_id")             
        
        const totalRows = await Candidate.count()

        const paginator = new Paginator(args.limit, args.page, totalRows);

        const totalPages = paginator.getTotalPages();

		const start = paginator.getStart();

		const end = paginator.getEnd();		

        const options: any = { attributes: fields, order: ['id'] }
        options.offset = start - 1;
        options.limit = args.limit;

        let candidates = await Candidate.findAll(options)
        candidates = candidates.map((c: any) => new CandidateDTO(c))

        const paginatedList = new PaginatedList('candidates', candidates, start, end, totalPages, paginator.getCurrentPage(), paginator.getLimitRows(), paginator.getMaxRows())
        return paginatedList;
    }

    return { findAll, findById, create, destroy, update, findAllPaginated, findByUserId }
}

export default candidatesRepository;
