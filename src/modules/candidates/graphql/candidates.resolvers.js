const { QueryTypes } = require('sequelize');
import { Candidate } from '../../../models';

const candidatesResolvers = {
    Query: {       
          allCandidates: async (parent, args, ctx, info) => {
            const fields = ctx.requestedFields.getFields(info, { keep: ["user_id"], exclude: ["user", ""] })            
            const sql = `SELECT ${fields.toString()} FROM candidates ORDER BY id ASC`
            const candidates = await ctx.orm.sequelize.query(sql, { type: QueryTypes.SELECT });
            return candidates;
          }
          
    },
    Candidate: {
      user: async (parent, args, ctx, info) => {        
          const users = await ctx.dataloaders.usersLoader.load({key: parent.user_id, info})
          return users[0];        
      }
    }
}

export default candidatesResolvers;