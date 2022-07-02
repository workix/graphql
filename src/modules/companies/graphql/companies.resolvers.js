import companiesRepository from "../repository/companies.repo";

const companiesResolvers = {
  Query: {
    allCompanies: async (parent, args, ctx, info) => {
      const companies = await companiesRepository(ctx.orm).findAll(info, args)
      return companies;
    },
    getCompanyById: async (parent, args, ctx, info) => {
      const company = await companiesRepository(ctx.orm).findById(info, args)
      return company;
    },
    allCompaniesPaginated: async (parent, args, ctx, info) => {
      const paginatedList = await companiesRepository(ctx.orm).findAllPaginated(info, args)
      return paginatedList;
    }

  },
  Mutation: {
    createCompany: async (parent, args, ctx, info) => {
      const company = await companiesRepository(ctx.orm).create(args)
      return company;
    },
    deleteCompany: async (parent, args, ctx, info) => {
      const deleted = await companiesRepository(ctx.orm).destroy(args)
      return deleted;
    },
    updateCompany: async (parent, args, ctx, info) => {
      const company = await companiesRepository(ctx.orm).update(args)
      return company;
    }   
  },
  Company: {
    user: async (parent, args, ctx, info) => {
      const users = await ctx.dataloaders.usersLoader.load({ key: parent.user_id, info })
      return users[0];
    },
    medias: async (parent, args, ctx, info) => {
      const medias = await ctx.dataloaders.companyMediaLoader.load({ key: parent.id, info })
      return medias;
    }
  }
}

export default companiesResolvers;