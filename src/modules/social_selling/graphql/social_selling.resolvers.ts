import socialSellingRepository from '../repository/social_selling.repo';
import SocialSellingScoreDTO from '../../../dtos/SocialSellingScoreDTO';

const socialSellingResolvers = {
  Query: {
    mySocialSellingIndex: async (parent: any, args: any, ctx: any, info: any) => {
      const score = await socialSellingRepository(ctx.orm).getLatestScore(args.userId);
      return score ? new SocialSellingScoreDTO(score) : null;
    }
  },
  Mutation: {
    recalculateSocialSellingIndex: async (parent: any, args: any, ctx: any, info: any) => {
      const score = await socialSellingRepository(ctx.orm).calculateScore(args.userId);
      return new SocialSellingScoreDTO(score);
    }
  }
};

export default socialSellingResolvers;
