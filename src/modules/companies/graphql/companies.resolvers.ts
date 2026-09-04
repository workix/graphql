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
    },
    companyIntegrityMetrics: async (parent, args, ctx, info) => {
      const { companyIntegrityService } = require('../services/company_integrity.service');
      const metrics = await companyIntegrityService.calculateResponseRate90d(args.companyId);
      return metrics;
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
      const userId = parent.userId || parent.user_id;
      const users = await ctx.dataloaders.usersLoader.load({ key: userId, info })
      return new UserDTO(users[0]);
    },
    email: async (parent, args, ctx, info) => {
      if (parent.email) return parent.email;
      const userId = parent.userId || parent.user_id;
      if (userId) {
        const users = await ctx.dataloaders.usersLoader.load({ key: userId, info });
        return users && users[0] ? users[0].email : '';
      }
      return '';
    },
    responseRate90d: (parent: any) => {
      return parent.response_rate_90d != null ? parseFloat(parent.response_rate_90d) : 100.0;
    },
    medianResponseTimeDays: (parent: any) => {
      return parent.median_response_time_days != null ? parseInt(parent.median_response_time_days, 10) : 7;
    },
    verifiedAt: (parent: any) => parent.verified_at || parent.verifiedAt || null,
    isVerified: (parent: any) => Boolean(parent.verified_at || parent.verifiedAt),
    medias: async (parent, args, ctx, info) => {
      let medias = await ctx.dataloaders.companyMediaLoader.load({ key: parent.id, info })
      medias = medias.map(m => new MediaDTO(m))
      return medias;
    }
  }
}

export default companiesResolvers;
