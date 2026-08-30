import companyPagesRepository from '../repository/company_pages.repo';
import CompanyPageDTO from '../../../dtos/CompanyPageDTO';

const companyPagesResolvers = {
  Query: {
    companyPage: async (parent: any, args: any, ctx: any, info: any) => {
      const page = await companyPagesRepository(ctx.orm).getCompanyPageById(args.id);
      return page ? new CompanyPageDTO(page) : null;
    },
    companyFollowersCount: async (parent: any, args: any, ctx: any, info: any) => {
      const count = await companyPagesRepository(ctx.orm).getCompanyFollowersCount(args.companyId);
      return count;
    }
  },
  Mutation: {
    createCompanyPage: async (parent: any, args: any, ctx: any, info: any) => {
      const page = await companyPagesRepository(ctx.orm).createCompanyPage(args.creatorUserId, args.input);
      return new CompanyPageDTO(page);
    },
    followCompany: async (parent: any, args: any, ctx: any, info: any) => {
      const res = await companyPagesRepository(ctx.orm).followCompany(args.companyId, args.userId);
      return !!res;
    },
    unfollowCompany: async (parent: any, args: any, ctx: any, info: any) => {
      const res = await companyPagesRepository(ctx.orm).unfollowCompany(args.companyId, args.userId);
      return res;
    }
  }
};

export default companyPagesResolvers;
