const { QueryTypes } = require('sequelize');
// import { Form } from '../../../models';

const formsResolvers = {
    Query: {       
          allForms: async (parent, args, ctx, info) => {
            const fields = ctx.requestedFields.getFields(info, { keep: [""], exclude: [""] })            
            const sql = `SELECT ${fields.toString()} FROM forms ORDER BY id ASC`
            const forms = await ctx.orm.sequelize.query(sql, { type: QueryTypes.SELECT });
            return forms;
          }
          
    }    
}

export default formsResolvers;