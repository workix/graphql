const { QueryTypes } = require('sequelize');
import { Blog, Comment } from '../../../models';

const blogsResolvers = {
  Query: {
    allBlogs: async (parent, args, ctx, info) => {
      const fields = ctx.requestedFields.getFields(info, { keep: ["author_id"], exclude: ["author", "comments", "pictures", "tags", "blog"] })
      const sql = `SELECT ${fields.toString()} FROM blogs ORDER BY id ASC`
      const blogs = await ctx.orm.sequelize.query(sql, { type: QueryTypes.SELECT });
      return blogs;
    },
    allComments: async (parent, args, ctx, info) => {
      const fields = ctx.requestedFields.getFields(info, { keep: [""], exclude: ["", ""] })
      const sql = `SELECT ${fields.toString()} FROM comments ORDER BY id ASC`
      const comments = await ctx.orm.sequelize.query(sql, { type: QueryTypes.SELECT });
      return comments;
    }
  },
  Blog: {
    author: async (parent, args, ctx, info) => {
      const authors = await ctx.dataloaders.authorLoader.load({ key: parent.author_id, info })
      return authors[0];
    },
    comments: async(parent, args, ctx, info) => {
      const comments = await ctx.dataloaders.commentsLoader.load({ key: parent.id, info })
      return comments;
    },
    pictures: async (parent, args, ctx, info) => {
      const pictures = await ctx.dataloaders.picturesLoader.load({ key: parent.id, info })
      return pictures;
    },
    tags: async (parent, args, ctx, info) => {
      const tags = await ctx.dataloaders.tagsLoader.load({ key: parent.id, info })
      return tags;
    }
  },
  Tag:{
    blog: async (parent, args, ctx, info) => {        
      const blogs = await ctx.dataloaders.blogsLoader.load({key: parent.id, info})
      return blogs[0];
    }
  },
  Picture:{
    blog: async (parent, args, ctx, info) => {        
      const blogs = await ctx.dataloaders.blogsLoader.load({key: parent.id, info})
      return blogs[0];
    }
  }
};

export default blogsResolvers;