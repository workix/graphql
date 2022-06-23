const { QueryTypes } = require('sequelize');
import {Blog} from '../../../models';

const blogsResolvers = {
    Query: {
        allBlogs: async (parent, args, ctx, info) => {
            const fields = ctx.requestedFields.getFields(info, { keep: ["author_id"], exclude: ["author", ""] })            
            const sql = `SELECT ${fields.toString()} FROM blogs ORDER BY id ASC`
            const blogs = await ctx.orm.sequelize.query(sql, { type: QueryTypes.SELECT });
            return blogs;
          }
          
    },
    Blog:{
        author: async (parent, args, ctx, info) => {        
          const authors = await ctx.dataloaders.authorLoader.load({key: parent.author_id, info})
          return authors[0];
        }
      }   
  };
  
  export default blogsResolvers;