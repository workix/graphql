import { Blog, Comment, BlogPicture, BlogTag } from '../../../models';
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
    debugBlog: async (parent, args, ctx, info) => {
      const blogs = await Blog.findAll({ include: [{ model: Comment, as: "comments" }, { model: BlogPicture, as: "pictures" },{ model: BlogTag, as: "tags" }], where: { id: [1, 2, 3, 4, 5] } })
      console.log("BLOG Comments ->", await blogs[0].getComments({raw: true}))
      console.log("BLOG Pictures ->", await blogs[0].getPictures({raw: true}))
      console.log("BLOG Tags ->", await blogs[0].getTags({raw: true}))
      return blogs
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
    debugComment: async (parent, args, ctx, info) => {
      const comments = await Comment.findAll({ include: [{ model: Blog }] })
      console.log("Comments Blog ->", await comments[0].getBlogs({raw: true}))      
      return comments
    },  
  },
  Mutation: {
    createBlog: async (parent, args, ctx, info) => {
      const blog = await blogsRepository(ctx.orm).create(args)
      return blog;
    },
    deleteBlog: async (parent, args, ctx, info) => {
      const deleted = await blogsRepository(ctx.orm).destroy(args)
      return deleted;
    },
    updateBlog: async (parent, args, ctx, info) => {
      const blog = await blogsRepository(ctx.orm).update(args)
      return blog;
    },
    createComment: async (parent, args, ctx, info) => {
      const comment = await commentsRepository(ctx.orm).create(args)
      return comment;
    },
    deleteComment: async (parent, args, ctx, info) => {
      const deleted = await commentsRepository(ctx.orm).destroy(args)
      return deleted;
    },
    updateComment: async (parent, args, ctx, info) => {
      const comment = await commentsRepository(ctx.orm).update(args)
      return comment;
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