import { UserProfile } from '../../../models';

const profilesRepository = (db: any, rabbitmqClient?: any) => {
  const findByUserId = async (userId: number) => {
    const profile = await UserProfile.findOne({
      where: { user_id: userId }
    });
    return profile;
  };

  const upsertProfile = async (userId: number, input: any) => {
    let profile = await UserProfile.findOne({
      where: { user_id: userId }
    });

    if (profile) {
      await profile.update({
        headline: input.headline,
        about: input.about,
        banner_url: input.bannerUrl,
        location: input.location,
        industry: input.industry,
        open_to_work: input.openToWork !== undefined ? input.openToWork : profile.open_to_work
      });
    } else {
      profile = await UserProfile.create({
        user_id: userId,
        headline: input.headline,
        about: input.about,
        banner_url: input.bannerUrl,
        location: input.location,
        industry: input.industry,
        open_to_work: input.openToWork || false
      });
    }

    if (rabbitmqClient) {
      const searchSyncPayload = JSON.stringify({
        action: 'INDEX',
        index: 'profiles',
        id: String(userId),
        document: {
          id: userId,
          headline: profile.headline,
          about: profile.about,
          location: profile.location,
          industry: profile.industry,
          openToWork: profile.open_to_work
        }
      });
      await rabbitmqClient.publishInQueue('search-index-sync', searchSyncPayload);
    }

    return profile;
  };

  return {
    findByUserId,
    upsertProfile
  };
};

export default profilesRepository;
