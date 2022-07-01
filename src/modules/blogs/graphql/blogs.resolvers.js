import blogsRepository from "../repository/blogs.repo";
import commentsRepository from "../repository/comments.repo";

const blogsResolvers = {
  Query: {
    allBlogs: async (parent, args, ctx, info) => {
      const blogs = await blogsRepository(ctx.orm).findAll(info,args)
      return blogs;
    },
    getBlogById: async (parent, args, ctx, info) => {
      const blog = await blogsRepository(ctx.orm).findById(info, args)
      return blog;
    },
    allBlogsPaginated: async (parent, args, ctx, info) => {
      const paginatedList = await blogsRepository(ctx.orm).findAllPaginated(info, args)
      return paginatedList;
    },  
    allComments: async (parent, args, ctx, info) => {
      const comments = await commentsRepository(ctx.orm).findAll(info,args)
      return comments;
    },
    getCommentById: async (parent, args, ctx, info) => {
      const comment = await commentsRepository(ctx.orm).findById(info, args)
      return comment;
    },
    allCommentsPaginated: async (parent, args, ctx, info) => {
      const paginatedList = await commentsRepository(ctx.orm).findAllPaginated(info, args)
      return paginatedList;
    },  
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
  },
  Comment:{
    blog: async (parent, args, ctx, info) => {            

      const owners = await ctx.dataloaders.commentsOwnerLoader.load({key: parent.id, info})
      const blogId = owners[0].blog_id      

      const blogs = await ctx.dataloaders.blogsLoader.load({key: blogId, info})      
      return blogs[0];
    }
  }
};

export default blogsResolvers;