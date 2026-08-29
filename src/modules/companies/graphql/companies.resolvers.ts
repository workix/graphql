import companiesRepository from "../repository/companies.repo";
import CompanyDTO from '../../../dtos/CompanyDTO'
import UserDTO from '../../../dtos/UserDTO'
import MediaDTO from '../../../dtos/MediaDTO'

const companiesResolvers = {
  Query: {
    allCompanies: async (parent, args, ctx, info) => {
      let companies = await companiesRepository(ctx.orm).findAll(info, args)
      companies = companies.map(c => new CompanyDTO(c))
      return companies;
    },
    getCompanyById: async (parent, args, ctx, info) => {
      const company = await companiesRepository(ctx.orm).findById(info, args)
      return new CompanyDTO(company);
    },
    allCompaniesPaginated: async (parent, args, ctx, info) => {
      const paginatedList = await companiesRepository(ctx.orm).findAllPaginated(info, args)
      return paginatedList;
    },
    listCompanyRandomLogos:  async (parent, args, ctx, info) => {
      let logos = await companiesRepository(ctx.orm).listRandomLogos(info, args)
      logos = logos.map(l => new CompanyDTO(l))
      return logos;
    }

  },
  Mutation: {
    createCompany: async (parent, args, ctx, info) => {
      const company = await companiesRepository(ctx.orm).create(args)
      return new CompanyDTO(company);
    },
    deleteCompany: async (parent, args, ctx, info) => {
      const deleted = await companiesRepository(ctx.orm).destroy(args)
      return deleted;
    },
    updateCompany: async (parent, args, ctx, info) => {
      const company = await companiesRepository(ctx.orm).update(args)
      return new CompanyDTO(company);
    }   
  },
  Company: {
    locale: async (parent, args, ctx, info) => {
      const { city, state, neighborhood, number, street, zipCode } = parent
      return {
        city, state, neighborhood, number, street, zipCode
      }
    },
    contact: async (parent, args, ctx, info) => {
      const { mobilePhone } = parent
      return {
        mobilePhone
      }
    },
    user: async (parent, args, ctx, info) => {
      const users = await ctx.dataloaders.usersLoader.load({ key: parent.user_id, info })
      return new UserDTO(users[0]);
    },
    medias: async (parent, args, ctx, info) => {
      let medias = await ctx.dataloaders.companyMediaLoader.load({ key: parent.id, info })
      medias = medias.map(m => new MediaDTO(m))
      return medias;
    }
  }
}

export default companiesResolvers;
