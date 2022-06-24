const { QueryTypes } = require('sequelize');
import { User } from '../../../models';

const usersResolvers = {
    Query: {       
          allUsers: async (parent, args, ctx, info) => {
            const fields = ctx.requestedFields.getFields(info, { keep: ["id"], exclude: ["", ""] })            
            const sql = `SELECT ${fields.toString()} FROM users ORDER BY id ASC`
            const users = await ctx.orm.sequelize.query(sql, { type: QueryTypes.SELECT });
            return users;
          }
          
    },
}

export default usersResolvers;