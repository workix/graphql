const { QueryTypes } = require('sequelize');
import {Author} from '../../../models';

const authorsResolvers = {
    Query: {
        hello: (parent, args, ctx, info) => {
            return 'Hello world!';
          },
          allAuthors: async (parent, args, ctx, info) => {
            const fields = ctx.requestedFields.getFields(info, { keep: ["id"], exclude: ["medias"] })            
            const sql = `SELECT ${fields.toString()} FROM authors ORDER BY id ASC`
            const authors = await ctx.orm.sequelize.query(sql, { type: QueryTypes.SELECT });
            return authors;
          }
          
    },
    /*Mutation: {

    },*/
    Author:{
      medias: async (parent, args, ctx, info) => {
        const sql = `SELECT * FROM authors_medias WHERE id = ${parent.id} ORDER BY id ASC`
        const medias = await ctx.orm.sequelize.query(sql, { type: QueryTypes.SELECT });
        return medias;
      }
    }
  };
  
  export default authorsResolvers;