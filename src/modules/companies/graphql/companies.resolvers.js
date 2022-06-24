const { QueryTypes } = require('sequelize');
import { Company } from '../../../models';

const companiesResolvers = {
    Query: {       
          allCompanies: async (parent, args, ctx, info) => {
            const fields = ctx.requestedFields.getFields(info, { keep: ["user_id"], exclude: ["user", ""] })            
            const sql = `SELECT ${fields.toString()} FROM companies ORDER BY id ASC`
            const companies = await ctx.orm.sequelize.query(sql, { type: QueryTypes.SELECT });
            return companies;
          }
          
    },
    Company: {
      user: async (parent, args, ctx, info) => {        
          const users = await ctx.dataloaders.usersLoader.load({key: parent.user_id, info})
          return users[0];        
      }
    }
}

export default companiesResolvers;