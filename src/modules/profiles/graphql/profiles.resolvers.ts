import profilesRepository from '../repository/profiles.repo';
import UserProfileDTO from '../../../dtos/UserProfileDTO';

const profilesResolvers = {
  Query: {
    getProfileByUserId: async (parent: any, args: any, ctx: any, info: any) => {
      const profile = await profilesRepository(ctx.orm, ctx.rabbitmq).findByUserId(args.userId);
      return profile ? new UserProfileDTO(profile) : null;
    }
  },
  Mutation: {
    updateMyProfile: async (parent: any, args: any, ctx: any, info: any) => {
      const profile = await profilesRepository(ctx.orm, ctx.rabbitmq).upsertProfile(args.userId, args.input);
      return new UserProfileDTO(profile);
    }
  }
};

export default profilesResolvers;
