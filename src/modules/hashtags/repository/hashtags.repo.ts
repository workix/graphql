import { Hashtag, PostHashtag, Mention, Post } from '../../../models';

const HASHTAG_REGEX = /#(\w+)/g;

export const extractHashtags = (content: string): string[] => {
  const matches = content.match(HASHTAG_REGEX) || [];
  const tags = matches.map((m) => m.slice(1).toLowerCase());
  return Array.from(new Set(tags));
};

const hashtagsRepository = (db: any, mqserver?: any) => {
  const attachHashtags = async (postId: number, content: string) => {
    const tags = extractHashtags(content);

    for (const tag of tags) {
      const [hashtag] = await Hashtag.findOrCreate({ where: { tag }, defaults: { tag } });
      await PostHashtag.create({ post_id: postId, hashtag_id: hashtag.id });
    }

    return tags;
  };

  const attachMentions = async (postId: number, authorId: number, mentionedUserIds: number[] = []) => {
    for (const mentionedUserId of mentionedUserIds) {
      await Mention.create({ post_id: postId, mentioned_user_id: mentionedUserId });

      if (mqserver) {
        await mqserver.publishInQueue('notifications', JSON.stringify({
          userId: mentionedUserId,
          type: 'MENTION',
          title: 'Você foi mencionado em um post',
          body: `O usuário ${authorId} mencionou você em um post`,
          payloadData: { postId, authorId }
        }));
      }
    }

    return mentionedUserIds;
  };

  const processPostContent = async (
    postId: number,
    authorId: number,
    content: string,
    mentionedUserIds: number[] = []
  ) => {
    const tags = await attachHashtags(postId, content);
    const mentions = await attachMentions(postId, authorId, mentionedUserIds);
    return { tags, mentions };
  };

  const getPostsByHashtag = async (tag: string, limit = 20, offset = 0) => {
    const hashtag = await Hashtag.findOne({ where: { tag: tag.toLowerCase() } });
    if (!hashtag) return [];

    const links = await PostHashtag.findAll({
      where: { hashtag_id: hashtag.id },
      order: [['created_at', 'DESC']],
      limit,
      offset
    });

    const postIds = links.map((l: any) => l.post_id);
    if (!postIds.length) return [];

    return await Post.findAll({
      where: { id: postIds },
      order: [['created_at', 'DESC']]
    });
  };

  const getPostHashtags = async (postId: number) => {
    const links = await PostHashtag.findAll({ where: { post_id: postId } });
    const hashtagIds = links.map((l: any) => l.hashtag_id);
    if (!hashtagIds.length) return [];

    return await Hashtag.findAll({ where: { id: hashtagIds } });
  };

  return {
    attachHashtags,
    attachMentions,
    processPostContent,
    getPostsByHashtag,
    getPostHashtags
  };
};

export default hashtagsRepository;
