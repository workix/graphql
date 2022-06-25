const { QueryTypes } = require('sequelize');
import {Author} from '../../../models';

const authorsResolvers = {
    Query: {
        hello: (parent, args, ctx, info) => {
            return 'Hello world!';
          },
          allAuthors: async (parent, args, ctx, info) => {
            const fields = ctx.requestedFields.getFields(info, { keep: ["id"], exclude: ["medias", "author"] })            
            const sql = `SELECT ${fields.toString()} FROM authors ORDER BY id ASC`
            const authors = await ctx.orm.sequelize.query(sql, { type: QueryTypes.SELECT });
            return authors;
          }
          
    },
    /*Mutation: {

    },*/
    Author:{
      medias: async (parent, args, ctx, info) => {        
        const medias = await ctx.dataloaders.mediaLoader.load({key: parent.id, info})
        return medias;
      }
    },
    AuthorMedia:{
      author: async (parent, args, ctx, info) => {        
        const authors = await ctx.dataloaders.authorLoader.load({key: parent.id, info})
        return authors[0];
      }
    }
  };
  
  export default authorsResolvers;