import endorsementsRepository from '../repository/endorsements.repo';
import SkillEndorsementDTO from '../../../dtos/SkillEndorsementDTO';
import RecommendationDTO from '../../../dtos/RecommendationDTO';

const endorsementsResolvers = {
  Query: {
    skillEndorsements: async (parent: any, args: any, ctx: any, info: any) => {
      const list = await endorsementsRepository(ctx.orm).getSkillEndorsements(args.skillId);
      return list.map((e: any) => new SkillEndorsementDTO(e));
    },
    userRecommendations: async (parent: any, args: any, ctx: any, info: any) => {
      const list = await endorsementsRepository(ctx.orm).getRecommendations(args.userId);
      return list.map((r: any) => new RecommendationDTO(r));
    }
  },
  Mutation: {
    endorseSkill: async (parent: any, args: any, ctx: any, info: any) => {
      const res = await endorsementsRepository(ctx.orm).endorseSkill(args.skillId, args.endorserId);
      return !!res;
    },
    unendorseSkill: async (parent: any, args: any, ctx: any, info: any) => {
      const res = await endorsementsRepository(ctx.orm).unendorseSkill(args.skillId, args.endorserId);
      return res;
    },
    createRecommendation: async (parent: any, args: any, ctx: any, info: any) => {
      const rec = await endorsementsRepository(ctx.orm).createRecommendation(
        args.recommenderId,
        args.recipientId,
        args.content
      );
      return new RecommendationDTO(rec);
    },
    respondToRecommendation: async (parent: any, args: any, ctx: any, info: any) => {
      const rec = await endorsementsRepository(ctx.orm).respondToRecommendation(
        args.recommendationId,
        args.recipientId,
        args.accept
      );
      return new RecommendationDTO(rec);
    }
  }
};

export default endorsementsResolvers;
