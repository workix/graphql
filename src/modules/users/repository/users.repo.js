const { QueryTypes } = require('sequelize');
import { RequestedFields } from '../../../RequestedFields';
import { User } from '../../../models';
import Paginator from '../../../utils/Paginator';
import PaginatedList from '../../../utils/PaginatedList';

const usersRepository = db => {
    const requestedFields = new RequestedFields();
    const getFields = info => requestedFields.getFields(info, { keep: ["id"], exclude: ["rows"] })

    const findAll = async (info, args) => {
        const fields = getFields(info)
        const options = { attributes: fields, order: ['id'] }
        if (args.start != null && args.max != null) {
            options.offset = args.start;
            options.limit = args.max;
        }
        const users = await User.findAll(options)
        return users;
    }

    const findById = async (info, args) => {
        const fields = getFields(info)
        const user = await User.findOne({ where: { id: args.id }, attributes: fields })
        return user;
    }

    const createUser = async args => {
        const user = await User.create(args.input)
        await user.reload()
        return user;
    }

    const deleteUser = async args => {
        const deleted = await User.destroy({ where: { id: args.id } })
        return deleted > 0
    }

    const updateUser = async args => {
        const [users, meta] = await User.update(args.input, { where: { id: args.id }, returning: true })

        if (meta == 0) {
            throw new Error(`User with id: ${args.id} not found`)
        }

        const user = await User.findOne({ where: { id: args.id } })

        return user;
    }

    const findAllPaginated = async (info, args) => {
        const fields = getFields(info)
        
        const totalRows = await User.count()

        const paginator = new Paginator(args.limit, args.page, totalRows);

        const totalPages = paginator.getTotalPages();

		const start = paginator.getStart();

		const end = paginator.getEnd();		

        const options = { /*attributes: fields,*/ order: ['id'] }
        options.offset = start - 1;
        options.limit = args.limit;

        const users = await User.findAll(options)

        const paginatedList = new PaginatedList(users, paginator.getStart(), paginator.getEnd(), paginator.getTotalPages(), paginator.getCurrentPage(), paginator.getLimitRows(), paginator.getMaxRows())
        return paginatedList;
    }

    return { findAll, findById, createUser, deleteUser, updateUser, findAllPaginated }
}

export default usersRepository;