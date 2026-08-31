import graphqlClient from './graphql';
import { PostModel } from './posts.service';

export interface HashtagModel {
  id: string | number;
  tag: string;
  createdAt?: string;
}

export const hashtagsService = {
  async getPostsByHashtag(tag: string, limit = 20, offset = 0): Promise<PostModel[]> {
    const cleanTag = tag.startsWith('#') ? tag.substring(1) : tag;
    const query = `
      query PostsByHashtag($tag: String!, $limit: Int, $offset: Int) {
        postsByHashtag(tag: $tag, limit: $limit, offset: $offset) {
          id
          authorId
          content
          mediaIds
          createdAt
          updatedAt
        }
      }
    `;

    try {
      const data = await graphqlClient.request<{ postsByHashtag: PostModel[] }>(query, {
        tag: cleanTag,
        limit,
        offset
      });
      return data.postsByHashtag || [];
    } catch (err) {
      console.warn(`Erro ao carregar posts para a hashtag #${cleanTag}:`, err);
      return [];
    }
  },

  async getPostHashtags(postId: string | number): Promise<HashtagModel[]> {
    const query = `
      query PostHashtags($postId: ID!) {
        postHashtags(postId: $postId) {
          id
          tag
          createdAt
        }
      }
    `;

    try {
      const data = await graphqlClient.request<{ postHashtags: HashtagModel[] }>(query, {
        postId: String(postId)
      });
      return data.postHashtags || [];
    } catch (err) {
      console.warn(`Erro ao carregar hashtags do post ${postId}:`, err);
      return [];
    }
  }
};

export default hashtagsService;
