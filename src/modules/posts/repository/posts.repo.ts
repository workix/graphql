import { Post, PostReaction, PostComment, Connection } from '../../../models';

const postsRepository = (db: any) => {
  const createPost = async (authorId: number, content: string, mediaIds?: number[]) => {
    const post = await Post.create({
      author_id: authorId,
      content,
      media_ids: mediaIds ? JSON.stringify(mediaIds) : null
    });
    return post;
  };

  const getFeed = async (userId: number, limit = 20, offset = 0) => {
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

    return posts;
  };

  const reactToPost = async (postId: number, userId: number, type: string) => {
    const validTypes = ['LIKE', 'CELEBRATE', 'SUPPORT', 'LOVE', 'INSIGHTFUL'];
    if (!validTypes.includes(type)) {
      throw new Error(`Invalid reaction type ${type}`);
    }

    const existing = await PostReaction.findOne({
      where: { post_id: postId, user_id: userId }
    });

    if (existing) {
      if (existing.type === type) {
        await existing.destroy();
        return null;
      }
      await existing.update({ type });
      return existing;
    }

    const reaction = await PostReaction.create({
      post_id: postId,
      user_id: userId,
      type
    });
    return reaction;
  };

  const commentOnPost = async (postId: number, authorId: number, content: string, parentId?: number) => {
    const comment = await PostComment.create({
      post_id: postId,
      author_id: authorId,
      content,
      parent_id: parentId || null
    });
    return comment;
  };

  const getPostReactions = async (postId: number) => {
    return await PostReaction.findAll({ where: { post_id: postId } });
  };

  const getPostComments = async (postId: number) => {
    return await PostComment.findAll({
      where: { post_id: postId },
      order: [['created_at', 'ASC']]
    });
  };

  const getCommentReplies = async (commentId: number) => {
    return await PostComment.findAll({
      where: { parent_id: commentId },
      order: [['created_at', 'ASC']]
    });
  };

  const getReactionsCount = async (postId: number) => {
    return await PostReaction.count({ where: { post_id: postId } });
  };

  const getCommentsCount = async (postId: number) => {
    return await PostComment.count({ where: { post_id: postId } });
  };

  const getUserReaction = async (postId: number, userId: number) => {
    const reaction = await PostReaction.findOne({ where: { post_id: postId, user_id: userId } });
    return reaction ? reaction.type : null;
  };

  return {
    createPost,
    getFeed,
    reactToPost,
    commentOnPost,
    getPostReactions,
    getPostComments,
    getCommentReplies,
    getReactionsCount,
    getCommentsCount,
    getUserReaction
  };
};

export default postsRepository;
