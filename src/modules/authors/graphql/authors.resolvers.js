const { QueryTypes } = require('sequelize');
import {Author} from '../../../models';

const authorsResolvers = {
    Query: {
        hello: (parent, args, ctx, info) => {
            return 'Hello world!';
          },
          allAuthors: async (parent, args, ctx, info) => {
            const fields = ctx.requestedFields.getFields(info, {})
            const sql = `SELECT ${fields.toString()} FROM authors ORDER BY id ASC`
            const authors = await ctx.orm.sequelize.query(sql, { type: QueryTypes.SELECT });
            return authors;
          }
    },
    /*Mutation: {

    },*/
  };
  
  export default authorsResolvers;