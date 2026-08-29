import CommentDTO from '../../../dtos/CommentDTO';
import { Blog, Comment, BlogPicture, BlogTag, BlogCategory } from '../../../models';
import blogsRepository from "../repository/blogs.repo";
import commentsRepository from "../repository/comments.repo";
import BlogDTO from '../../../dtos/BlogDTO'
import AuthorDTO from '../../../dtos/AuthorDTO'
import PictureDTO from '../../../dtos/PictureDTO'
import CategoryDTO from '../../../dtos/CategoryDTO'
import TagDTO from '../../../dtos/TagDTO'

const blogsResolvers = {
  Query: {
    allBlogs: async (parent, args, ctx, info) => {
      let blogs = await blogsRepository(ctx.orm).findAll(info, args)
      blogs = blogs.map(b => new BlogDTO(b))
      return blogs;
    },
    getBlogById: async (parent, args, ctx, info) => {
      const blog = await blogsRepository(ctx.orm).findById(info, args)
      return new BlogDTO(blog);
    },
    allBlogsPaginated: async (parent, args, ctx, info) => {
      const paginatedList = await blogsRepository(ctx.orm).findAllPaginated(info, args)
      return paginatedList;
    },
    debugBlog: async (parent, args, ctx, info) => {
      let blogs = await Blog.findAll({ include: [{ model: Comment, as: "comments" }, { model: BlogPicture, as: "pictures" }, { model: BlogTag, as: "tags" }, { model: BlogCategory, as: "categories" }], where: { id: [1, 2, 3, 4, 5] } })
      console.log("BLOG Comments ->", await blogs[0].getComments({ raw: true }))
      console.log("BLOG Pictures ->", await blogs[0].getPictures({ raw: true }))
      console.log("BLOG Tags ->", await blogs[0].getTags({ raw: true }))
      console.log("BLOG Categories ->", await blogs[0].getCategories({ raw: true }))
      blogs = blogs.map(b => new BlogDTO(b))
      return blogs
    },
    allComments: async (parent, args, ctx, info) => {
      let comments = await commentsRepository(ctx.orm).findAll(info, args)
      comments = comments.map(c => new CommentDTO(c))
      return comments;
    },
    getCommentById: async (parent, args, ctx, info) => {
      const comment = await commentsRepository(ctx.orm).findById(info, args)
      return new CommentDTO(comment);
    },
    allCommentsPaginated: async (parent, args, ctx, info) => {
      const paginatedList = await commentsRepository(ctx.orm).findAllPaginated(info, args)
      return paginatedList;
    },
    debugComment: async (parent, args, ctx, info) => {
      let comments = await Comment.findAll({ include: [{ model: Blog }] })
      console.log("Comments Blog ->", await comments[0].getBlogs({ raw: true }))
      console.log("Comments Parent ->", await comments[0].getParentComment({ raw: true }))
      comments = comments.map(c => new CommentDTO(c))
      return comments
    },
    allBlogsCategories: async (parent, args, ctx, info) => {
      const categories = await blogsRepository(ctx.orm).findAllCategories(info, args)
      return categories;
    },
    allBlogsTimePeriods: async (parent, args, ctx, info) => {
      const timePeriods = await blogsRepository(ctx.orm).findAllTimePeriods(info, args)
      return timePeriods;
    },
    allBlogsRecents: async (parent, args, ctx, info) => {
      let blogs = await blogsRepository(ctx.orm).findAllRecents(info, args)
      blogs = blogs.map(b => new BlogDTO(b))
      return blogs;
    },
    allCommentsRecents: async (parent, args, ctx, info) => {
      let comments = await commentsRepository(ctx.orm).findAllRecents(info, args)
      comments = comments.map(c => new CommentDTO(c))
      return comments;
    },
  },
  Mutation: {
    createBlog: async (parent, args, ctx, info) => {
      const blog = await blogsRepository(ctx.orm).create(args)
      return new BlogDTO(blog);
    },
    deleteBlog: async (parent, args, ctx, info) => {
      const deleted = await blogsRepository(ctx.orm).destroy(args)
      return deleted;
    },
    updateBlog: async (parent, args, ctx, info) => {
      const blog = await blogsRepository(ctx.orm).update(args)
      return new BlogDTO(blog);
    },
    createComment: async (parent, args, ctx, info) => {
      const comment = await commentsRepository(ctx.orm).create(args)
      return new CommentDTO(comment);
    },
    deleteComment: async (parent, args, ctx, info) => {
      const deleted = await commentsRepository(ctx.orm).destroy(args)
      return deleted;
    },
    updateComment: async (parent, args, ctx, info) => {
      const comment = await commentsRepository(ctx.orm).update(args)
      return new CommentDTO(comment);
    }
  },
  Blog: {
    author: async (parent, args, ctx, info) => {
      const authors = await ctx.dataloaders.authorLoader.load({ key: parent.authorId, info })
      return new AuthorDTO(authors[0]);
    },
    comments: async (parent, args, ctx, info) => {
      let comments = await ctx.dataloaders.commentsLoader.load({ key: parent.id, info })
      comments = comments.map(c => new CommentDTO(c))
      return comments;
    },
    pictures: async (parent, args, ctx, info) => {
      let pictures = await ctx.dataloaders.picturesLoader.load({ key: parent.id, info })
      pictures = pictures.map(p => new PictureDTO(p))
      return pictures;
    },
    tags: async (parent, args, ctx, info) => {
      let tags = await ctx.dataloaders.tagsLoader.load({ key: parent.id, info })
      tags = tags.map(t => new TagDTO(t))
      return tags;
    },
    categories: async (parent, args, ctx, info) => {
      let categories = await ctx.dataloaders.categoriesLoader.load({ key: parent.id, info })
      categories = categories.map(c => new CategoryDTO(c))
      return categories;
    }
  },
  Tag: {
    blog: async (parent, args, ctx, info) => {
      const blogs = await ctx.dataloaders.blogsLoader.load({ key: parent.id, info })
      return new BlogDTO(blogs[0]);
    }
  },
  Picture: {
    blog: async (parent, args, ctx, info) => {
      const blogs = await ctx.dataloaders.blogsLoader.load({ key: parent.id, info })
      return new BlogDTO(blogs[0]);
    }
  },
  Category: {
    blog: async (parent, args, ctx, info) => {
      const blogs = await ctx.dataloaders.blogsLoader.load({ key: parent.id, info })
      return new BlogDTO(blogs[0]);
    }
  },
  Comment: {
    blog: async (parent, args, ctx, info) => {

      const owners = await ctx.dataloaders.commentsOwnerLoader.load({ key: parent.id, info })
      const blogId = owners[0].blog_id

      const blogs = await ctx.dataloaders.blogsLoader.load({ key: blogId, info })
      return new BlogDTO(blogs[0]);
    },
    parentComment: async (parent, args, ctx, info) => {
      const comments = await ctx.dataloaders.commentsParentLoader.load({ key: parent.parentId, info })
      return new CommentDTO(comments[0]);
    }
  }
};

export default blogsResolvers;
