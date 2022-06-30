import { Author, AuthorMedia } from '../../../models';
import authorsRepository from "../repository/authors.repo";


const authorsResolvers = {
  Query: {
    allAuthors: async (parent, args, ctx, info) => {
      const authors = await authorsRepository(ctx.orm).findAll(info, args)
      return authors;
    },
    getAuthorById: async (parent, args, ctx, info) => {
      const author = await authorsRepository(ctx.orm).findById(info, args)
      return author;
    },
    allAuthorsPaginated: async (parent, args, ctx, info) => {
      const paginatedList = await authorsRepository(ctx.orm).findAllPaginated(info, args)
      return paginatedList;
    },
    debugAuthor: async (parent, args, ctx, info) => {
      const authors = await Author.findAll({ include: { model: AuthorMedia, as: "medias" }, where: { id: [1, 2, 3, 4, 5] } })
      console.log(await authors[0].getMedias({raw: true}))
      return authors
    }

  },
  Mutation: {
    createAuthor: async (parent, args, ctx, info) => {
      const author = await authorsRepository(ctx.orm).create(args)
      return author;
    },
    deleteAuthor: async (parent, args, ctx, info) => {
      const deleted = await authorsRepository(ctx.orm).destroy(args)
      return deleted;
    },
    updateAuthor: async (parent, args, ctx, info) => {
      const author = await authorsRepository(ctx.orm).update(args)
      return author;
    }
  },
  Author: {
    medias: async (parent, args, ctx, info) => {
      const medias = await ctx.dataloaders.mediaLoader.load({ key: parent.id, info })
      return medias;
    }
  },
  AuthorMedia: {
    author: async (parent, args, ctx, info) => {
      const authors = await ctx.dataloaders.authorLoader.load({ key: parent.id, info })
      return authors[0];
    }
  }
};

export default authorsResolvers;