import { Post, Connection, PostReaction, PostComment, DirectMessage, SocialSellingScore } from '../../../models';

export const scaleScore = (count: number, factor: number): number => {
  return Math.min(100, Math.round(count * factor));
};

const socialSellingRepository = (db: any) => {
  const calculateScore = async (userId: number) => {
    const orOp = db.Sequelize?.Op?.or || '$or';

    const postsCount = await Post.count({ where: { author_id: userId } });

    const connectionsCount = await Connection.count({
      where: { [orOp]: [{ user_id_1: userId }, { user_id_2: userId }] }
    });

    const userPosts = await Post.findAll({ where: { author_id: userId }, attributes: ['id'] });
    const postIds = userPosts.map((p: any) => p.id);

    let engagementCount = 0;
    if (postIds.length) {
      const reactionsCount = await PostReaction.count({ where: { post_id: postIds } });
      const commentsCount = await PostComment.count({ where: { post_id: postIds } });
      engagementCount = reactionsCount + commentsCount;
    }

    const messagesCount = await DirectMessage.count({
      where: { [orOp]: [{ sender_id: userId }, { recipient_id: userId }] }
    });

    const postsScore = scaleScore(postsCount, 5);
    const networkScore = scaleScore(connectionsCount, 2);
    const engagementScore = scaleScore(engagementCount, 2);
    const relationshipsScore = scaleScore(messagesCount, 2);
    const score = Math.round((postsScore + networkScore + engagementScore + relationshipsScore) / 4);

    const fields = {
      score,
      posts_score: postsScore,
      network_score: networkScore,
      engagement_score: engagementScore,
      relationships_score: relationshipsScore,
      calculated_at: new Date()
    };

    const existing = await SocialSellingScore.findOne({ where: { user_id: userId } });
    if (existing) {
      await existing.update(fields);
      return existing;
    }

    return await SocialSellingScore.create({ user_id: userId, ...fields });
  };

  const getLatestScore = async (userId: number) => {
    return await SocialSellingScore.findOne({ where: { user_id: userId } });
  };

  return {
    calculateScore,
    getLatestScore
  };
};

export default socialSellingRepository;
