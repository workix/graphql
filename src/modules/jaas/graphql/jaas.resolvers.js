import jaasUsersRepository from "../repository/jaas_users.repo";
import jaasRolesRepository from "../repository/jaas_roles.repo";

const jaasResolvers = {
    Query: {
        allJAASUsers: async (parent, args, ctx, info) => {
            const jaasUsers = await jaasUsersRepository(ctx.orm).findAll(info, args)
            return jaasUsers;
        },
        getJAASUserById: async (parent, args, ctx, info) => {
            const jaasUser = await jaasUsersRepository(ctx.orm).findById(info, args)
            return jaasUser;
        },
        allJAASUsersPaginated: async (parent, args, ctx, info) => {
            const paginatedList = await jaasUsersRepository(ctx.orm).findAllPaginated(info, args)
            return paginatedList;
        },
        allJAASRoles: async (parent, args, ctx, info) => {
            const jaasRoles = await jaasRolesRepository(ctx.orm).findAll(info, args)
            return jaasRoles;
        },
        getJAASRoleById: async (parent, args, ctx, info) => {
            const jaasRole = await jaasRolesRepository(ctx.orm).findById(info, args)
            return jaasRole;
        },
        allJAASRolesPaginated: async (parent, args, ctx, info) => {
            const paginatedList = await jaasRolesRepository(ctx.orm).findAllPaginated(info, args)
            return paginatedList;
        },
    },
    Mutation: {
        createJAASUser: async (parent, args, ctx, info) => {
            const jaasUser = await jaasUsersRepository(ctx.orm).create(args)
            return jaasUser;
        },
        deleteJAASUser: async (parent, args, ctx, info) => {
            const deleted = await jaasUsersRepository(ctx.orm).destroy(args)
            return deleted;
        },
        updateJAASUser: async (parent, args, ctx, info) => {
            const jaasUser = await jaasUsersRepository(ctx.orm).update(args)
            return jaasUser;
        },
        createJAASRole: async (parent, args, ctx, info) => {
            const jaasRole = await jaasRolesRepository(ctx.orm).create(args)
            return jaasRole;
        },
        deleteJAASUser: async (parent, args, ctx, info) => {
            const deleted = await jaasRolesRepository(ctx.orm).destroy(args)
            return deleted;
        },
        updateJAASUser: async (parent, args, ctx, info) => {
            const jaasRole = await jaasRolesRepository(ctx.orm).update(args)
            return jaasRole;
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