import jaasUsersRepository from "../repository/jaas_users.repo";
import jaasRolesRepository from "../repository/jaas_roles.repo";
import JAASUserDTO from '../../../dtos/JAASUserDTO'
import JAASRoleDTO from '../../../dtos/JAASRoleDTO'

const jaasResolvers = {
    Query: {
        allJAASUsers: async (parent, args, ctx, info) => {
            let jaasUsers = await jaasUsersRepository(ctx.orm).findAll(info, args)
            jaasUsers = jaasUsers.map(u => new JAASUserDTO(u))
            return jaasUsers;
        },
        getJAASUserById: async (parent, args, ctx, info) => {
            const jaasUser = await jaasUsersRepository(ctx.orm).findById(info, args)
            return new JAASUserDTO(jaasUser);
        },
        allJAASUsersPaginated: async (parent, args, ctx, info) => {
            const paginatedList = await jaasUsersRepository(ctx.orm).findAllPaginated(info, args)
            return paginatedList;
        },
        allJAASRoles: async (parent, args, ctx, info) => {
            let jaasRoles = await jaasRolesRepository(ctx.orm).findAll(info, args)
            jaasRoles = jaasRoles.map(r => new JAASRoleDTO(r))
            return jaasRoles;
        },
        getJAASRoleByName: async (parent, args, ctx, info) => {
            const jaasRole = await jaasRolesRepository(ctx.orm).findByName(info, args)
            return new JAASRoleDTO(jaasRole);
        },
        allJAASRolesPaginated: async (parent, args, ctx, info) => {
            const paginatedList = await jaasRolesRepository(ctx.orm).findAllPaginated(info, args)
            return paginatedList;
        },
    },
    Mutation: {
        createJAASUser: async (parent, args, ctx, info) => {
            const jaasUser = await jaasUsersRepository(ctx.orm).create(args)
            return new JAASUserDTO(jaasUser);
        },
        deleteJAASUser: async (parent, args, ctx, info) => {
            const deleted = await jaasUsersRepository(ctx.orm).destroy(args)
            return deleted;
        },
        updateJAASUser: async (parent, args, ctx, info) => {
            const jaasUser = await jaasUsersRepository(ctx.orm).update(args)
            return new JAASUserDTO(jaasUser);
        },
        createJAASRole: async (parent, args, ctx, info) => {
            const jaasRole = await jaasRolesRepository(ctx.orm).create(args)
            return new JAASRoleDTO(jaasRole);
        },
        deleteJAASRole: async (parent, args, ctx, info) => {
            const deleted = await jaasRolesRepository(ctx.orm).destroy(args)
            return deleted;
        },
        updateJAASRole: async (parent, args, ctx, info) => {
            const jaasRole = await jaasRolesRepository(ctx.orm).update(args)
            return new JAASRoleDTO(jaasRole);
        }
    },
    JAASUser: {
        roles: async (parent, args, ctx, info) => {
            const roles = await ctx.dataloaders.rolesLoader.load({ key: parent.id, info })

            const renamed = roles.map(i => ({ id: i.id, name: i.role_name }))
            return renamed;
        }
    }

}

export default jaasResolvers;
