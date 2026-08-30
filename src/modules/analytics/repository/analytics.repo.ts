import { ProfileView, PostAnalytics } from '../../../models';

const analyticsRepository = (db: any) => {
  const recordProfileView = async (viewedId: number, viewerId: number) => {
    if (viewedId === viewerId) {
      throw new Error('Cannot record a view of your own profile');
    }

    return await ProfileView.create({ viewed_id: viewedId, viewer_id: viewerId });
  };

  const getProfileViews = async (viewedId: number, limit = 20, offset = 0) => {
    return await ProfileView.findAll({
      where: { viewed_id: viewedId },
      order: [['viewed_at', 'DESC']],
      limit,
      offset
    });
  };

  const recordPostView = async (postId: number) => {
    const analytics = await PostAnalytics.findOne({ where: { post_id: postId } });

    if (!analytics) {
      return await PostAnalytics.create({ post_id: postId, views_count: 1, shares_count: 0 });
    }

    await analytics.update({ views_count: analytics.views_count + 1 });
    return analytics;
  };

  const recordPostShare = async (postId: number) => {
    const analytics = await PostAnalytics.findOne({ where: { post_id: postId } });

    if (!analytics) {
      return await PostAnalytics.create({ post_id: postId, views_count: 0, shares_count: 1 });
    }

    await analytics.update({ shares_count: analytics.shares_count + 1 });
    return analytics;
  };

  const getPostAnalytics = async (postId: number) => {
    return await PostAnalytics.findOne({ where: { post_id: postId } });
  };

  return {
    recordProfileView,
    getProfileViews,
    recordPostView,
    recordPostShare,
    getPostAnalytics
  };
};

export default analyticsRepository;
