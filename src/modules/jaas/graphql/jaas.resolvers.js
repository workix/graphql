const { QueryTypes } = require('sequelize');
// import { JaasUser, JaasRole } from '../../../models';

const jaasResolvers = {
    Query: {
        allJAASUsers: async (parent, args, ctx, info) => {
            const fields = ctx.requestedFields.getFields(info, { keep: ["id"], exclude: ["roles"] })
            const sql = `SELECT ${fields.toString()} FROM JAAS_User ORDER BY id ASC`
            const jaasUsers = await ctx.orm.sequelize.query(sql, { type: QueryTypes.SELECT });
            return jaasUsers;
        },
        allJAASRoles: async (parent, args, ctx, info) => {
            const fields = ctx.requestedFields.getFields(info, { keep: [], exclude: [] })
            const sql = `SELECT ${fields.toString()} FROM JAAS_Role ORDER BY name ASC`
            const jaasRoles = await ctx.orm.sequelize.query(sql, { type: QueryTypes.SELECT });
            return jaasRoles;
        }
    },
    JAASUser: {
        roles: async (parent, args, ctx, info) => {
          const roles = await ctx.dataloaders.rolesLoader.load({key: parent.id, info})
          
          const renamed = roles.map(i => ({id: i.id, name: i.role_name}))
          return renamed;    
        }
    }

}

export default jaasResolvers;