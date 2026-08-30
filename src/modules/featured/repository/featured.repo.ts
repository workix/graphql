import { FeaturedItem, Post, Connection, PostReaction } from '../../../models';

const featuredRepository = (db: any) => {
  const addFeaturedItem = async (userId: number, type: string, title: string, url?: string, mediaId?: number) => {
    const validTypes = ['POST', 'ARTICLE', 'LINK', 'MEDIA'];
    if (!validTypes.includes(type)) {
      throw new Error(`Invalid featured item type ${type}`);
    }

    const item = await FeaturedItem.create({
      user_id: userId,
      type,
      title,
      url,
      media_id: mediaId
    });

    return item;
  };

  const removeFeaturedItem = async (id: number, userId: number) => {
    const item = await FeaturedItem.findOne({
      where: { id, user_id: userId }
    });

    if (item) {
      await item.destroy();
      return true;
    }
    return false;
  };

  const getUserFeaturedItems = async (userId: number) => {
    return await FeaturedItem.findAll({
      where: { user_id: userId },
      order: [['created_at', 'DESC']]
    });
  };

  const getRankedFeed = async (userId: number, limit = 20, offset = 0) => {
    const connections = await Connection.findAll({
      where: {
        [db.Sequelize.Op?.or || '$or']: [
          { user_id_1: userId },
          { user_id_2: userId }
        ]
      }
    });

    const friendIds = connections.map((c: any) => c.user_id_1 === userId ? c.user_id_2 : c.user_id_1);
    const authorIds = [userId, ...friendIds];

    const posts = await Post.findAll({
      where: {
        author_id: authorIds
      },
      order: [['created_at', 'DESC']],
      limit,
      offset
    });

    // Score posts: 1st degree posts get bonus score
    const scoredPosts = posts.map((p: any) => {
      const authorId = p.author_id !== undefined ? p.author_id : p.dataValues?.author_id;
      const createdAt = p.created_at || p.dataValues?.created_at;
      const isDirect = friendIds.includes(authorId);
      const score = (isDirect ? 100 : 50) + new Date(createdAt || Date.now()).getTime() / 1000000000;
      return { ...(p.dataValues || p), score };
    });

    scoredPosts.sort((a: any, b: any) => b.score - a.score);

    return scoredPosts;
  };

  return {
    addFeaturedItem,
    removeFeaturedItem,
    getUserFeaturedItems,
    getRankedFeed
  };
};

export default featuredRepository;
