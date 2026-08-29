const { QueryTypes } = require('sequelize');
import { RequestedFields } from '../../../RequestedFields';
import { User } from '../../../models';
import Paginator from '../../../utils/Paginator';
import PaginatedList from '../../../utils/PaginatedList';
import UserDTO from '../../../dtos/UserDTO';
import { CreateUserDTO, UpdateUserDTO } from '../../../dtos/UserMutationDTO';

const usersRepository = (db: any) => {
    const requestedFields = new RequestedFields();
    const getFields = (info: any) => requestedFields.getFields(info, { keep: ["id"], exclude: [] })
    const getFieldsWithSubfields = (info: any) => requestedFields.getFieldsWithSubfields(info, { keep: ["id"], exclude: [] })

    const findAll = async (info: any, args: any) => {
        const fields = getFields(info)
        const options: any = { attributes: fields, order: ['id'] }
        if (args.start != null && args.max != null) {
            options.offset = args.start;
            options.limit = args.max;
        }        
        const users = await User.findAll(options)        
        return users;
    }

    const findById = async (info: any, args: any) => {
        const fields = getFields(info)
        const user = await User.findOne({ where: { id: args.id }, attributes: fields })
        return user;
    }

    const create = async (args: any) => {        
        const user = await User.create(new CreateUserDTO(args.input) as any)        
        await user.reload()
        return user;
    }

    const destroy = async (args: any) => {
        const deleted = await User.destroy({ where: { id: args.id } })
        return deleted > 0
    }

    const update = async (args: any) => {
        const u = await User.findByPk(args.id, { attributes: ["id"], raw: true })

        if (!u) {
            throw new Error(`User with id: ${args.id} not found`)
        }

        const [users, meta] = await User.update(new UpdateUserDTO(args.input) as any, { where: { id: args.id }, returning: true, individualHooks: true })

        const user = await User.findOne({ where: { id: args.id } })

        return user;
    }

    const findAllPaginated = async (info: any, args: any) => {           
        
        const fields = getFieldsWithSubfields(info).get("users")              
        
        const totalRows = await User.count()

        const paginator = new Paginator(args.limit, args.page, totalRows);

        const totalPages = paginator.getTotalPages();

		const start = paginator.getStart();

		const end = paginator.getEnd();		

        const options: any = { attributes: fields, order: ['id'] }
        options.offset = start - 1;
        options.limit = args.limit;

        let users = await User.findAll(options)
        users = users.map((u: any) => new UserDTO(u))

        const paginatedList = new PaginatedList('users', users, start, end, totalPages, paginator.getCurrentPage(), paginator.getLimitRows(), paginator.getMaxRows())
        return paginatedList;
    }

    return { findAll, findById, create, destroy, update, findAllPaginated }
}

export default usersRepository;
