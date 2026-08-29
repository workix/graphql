import { Author, AuthorMedia } from '../../../models';
import authorsRepository from "../repository/authors.repo";
import AuthorDTO from '../../../dtos/AuthorDTO'
import MediaDTO from '../../../dtos/MediaDTO'


const authorsResolvers = {
  Query: {
    allAuthors: async (parent, args, ctx, info) => {
      let authors = await authorsRepository(ctx.orm).findAll(info, args)
      authors = authors.map(a => new AuthorDTO(a))
      return authors;
    },
    getAuthorById: async (parent, args, ctx, info) => {
      const author = await authorsRepository(ctx.orm).findById(info, args)
      return new AuthorDTO(author);
    },
    allAuthorsPaginated: async (parent, args, ctx, info) => {
      const paginatedList = await authorsRepository(ctx.orm).findAllPaginated(info, args)
      return paginatedList;
    },
    debugAuthor: async (parent, args, ctx, info) => {
      let authors = await Author.findAll({ include: { model: AuthorMedia, as: "medias" }, where: { id: [1, 2, 3, 4, 5] } })
      console.log(await authors[0].getMedias({raw: true}))
      authors = authors.map(a => new AuthorDTO(a))      
      return authors
    }

  },
  Mutation: {
    createAuthor: async (parent, args, ctx, info) => {
      const author = await authorsRepository(ctx.orm).create(args)
      return new AuthorDTO(author);
    },
    deleteAuthor: async (parent, args, ctx, info) => {
      const deleted = await authorsRepository(ctx.orm).destroy(args)
      return deleted;
    },
    updateAuthor: async (parent, args, ctx, info) => {
      const author = await authorsRepository(ctx.orm).update(args)
      return new AuthorDTO(author);
    }
  },
  Author: {
    medias: async (parent, args, ctx, info) => {
      let medias = await ctx.dataloaders.mediaLoader.load({ key: parent.id, info })
      medias = medias.map(m => new MediaDTO(m))
      return medias;
    }
  },
  AuthorMedia: {
    author: async (parent, args, ctx, info) => {
      const authors = await ctx.dataloaders.authorLoader.load({ key: parent.id, info })
      return new AuthorDTO(authors[0]);
    }
  }
};

export default authorsResolvers;
