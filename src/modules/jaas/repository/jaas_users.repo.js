const { QueryTypes } = require('sequelize');
import { RequestedFields } from '../../../RequestedFields';
import { JAASUser, JAASRole } from '../../../models';
import Paginator from '../../../utils/Paginator';
import PaginatedList from '../../../utils/PaginatedList';
import JAASUserDTO from '../../../dtos/JAASUserDTO';
import { CreateJAASUserDTO, UpdateJAASUserDTO } from '../../../dtos/JAASUserMutationDTO'

const jaasUsersRepository = db => {
    const requestedFields = new RequestedFields();
    const getFields = info => requestedFields.getFields(info, { keep: ["id"], exclude: ["roles"] })
    const getFieldsWithSubfields = info => requestedFields.getFieldsWithSubfields(info, { keep: ["id"], exclude: ["roles"] })

    const findAll = async (info, args) => {
        const fields = getFields(info)
        const options = { attributes: fields, order: ['id'] }
        if (args.start != null && args.max != null) {
            options.offset = args.start;
            options.limit = args.max;
        }
        const jaasUsers = await JAASUser.findAll(options)
        return jaasUsers;
    }

    const findById = async (info, args) => {
        const fields = getFields(info)
        const jaasUser = await JAASUser.findOne({ where: { id: args.id }, attributes: fields })
        return jaasUser;
    }

    const create = async args => {
        let jaasUser;
        try {
            await db.sequelize.transaction(async transaction => {
                // { include: { model: JAASRole, as: "roles" } }
                jaasUser = await JAASUser.create(new CreateJAASUserDTO(args.input) , { transaction })
                
                if (args.input.roles) {
                    for (let r of args.input.roles) {
                        const role = await JAASRole.findByPk(r.name, { transaction })
                        await jaasUser.addRole(role, { transaction })
                    }
                }
                await jaasUser.reload({ transaction })
            });
        } catch (error) {
            console.error(error)
            if (error.errors) {
                const errors = error.errors.map(e => e.message)
                throw new Error(errors.toString())
            } else {
                throw new Error(error.message)
            }
        }


        return jaasUser;
    }

    const destroy = async args => {
        const deleted = await JAASUser.destroy({ where: { id: args.id } })
        return deleted > 0
    }

    const update = async args => {
        let jaasUser;
        const u = await JAASUser.findByPk(args.id, { attributes: ["id"], raw: true })

        if (!u) {
            throw new Error(`JAASUser with id: ${args.id} not found`)
        }

        await db.sequelize.transaction(async transaction => {
            const [jaasUsers, meta] = await JAASUser.update(new UpdateJAASUserDTO(args.input), { where: { id: args.id }, returning: true }, { transaction })

            jaasUser = await JAASUser.findOne({ where: { id: args.id }, include: { model: JAASRole, as: "roles" } }, { transaction })            

            if (args.input.roles) {
                for(let r of jaasUser.roles){
                    await jaasUser.removeRole(r, { transaction })
                }               

                for (let r of args.input.roles) {
                    const role = await JAASRole.findByPk(r.name, { transaction })
                    await jaasUser.addRole(role, { transaction })
                }
            }
        })

        return jaasUser;
    }

    const findAllPaginated = async (info, args) => {

        const fields = getFieldsWithSubfields(info).get("jaasUsers")

        const totalRows = await JAASUser.count()

        const paginator = new Paginator(args.limit, args.page, totalRows);

        const totalPages = paginator.getTotalPages();

        const start = paginator.getStart();

        const end = paginator.getEnd();

        const options = { attributes: fields, order: ['id'] }
        options.offset = start - 1;
        options.limit = args.limit;

        let jaasUsers = await JAASUser.findAll(options)
        jaasUsers = jaasUsers.map(u => new JAASUserDTO(u))

        const paginatedList = new PaginatedList('jaasUsers', jaasUsers, start, end, totalPages, paginator.getCurrentPage(), paginator.getLimitRows(), paginator.getMaxRows())
        return paginatedList;
    }

    return { findAll, findById, create, destroy, update, findAllPaginated }
}

export default jaasUsersRepository;