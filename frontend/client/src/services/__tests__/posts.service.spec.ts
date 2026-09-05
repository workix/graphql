import { describe, it, expect, beforeEach, vi } from 'vitest';
import postsService from '../posts.service';
import graphqlClient from '../graphql';

vi.mock('../graphql', () => ({
  default: {
    request: vi.fn()
  }
}));

describe('postsService (Client)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getSocialFeed retorna lista de posts do usuario', async () => {
    const mockPosts = [
      { id: '1', authorId: '10', content: 'Novo artigo publicado!', mediaIds: [] }
    ];
    (graphqlClient.request as any).mockResolvedValueOnce({ socialFeed: mockPosts });

    const feed = await postsService.getSocialFeed('10', 20, 0);
    expect(feed).toHaveLength(1);
    expect(feed[0].content).toBe('Novo artigo publicado!');
  });

  it('getRankedSocialFeed retorna feed ordenado ou faz fallback para getSocialFeed', async () => {
    (graphqlClient.request as any).mockRejectedValueOnce(new Error('Ranked feed unavailable'));
    (graphqlClient.request as any).mockResolvedValueOnce({
      socialFeed: [{ id: '2', authorId: '10', content: 'Fallback post' }]
    });

    const feed = await postsService.getRankedSocialFeed('10');
    expect(feed).toHaveLength(1);
    expect(feed[0].content).toBe('Fallback post');
  });

  it('createPost envia mutation CreatePost com mencoes e midias', async () => {
    (graphqlClient.request as any).mockResolvedValueOnce({
      createPost: { id: '100', authorId: '5', content: 'Anúncio oficial', mediaIds: ['1', '2'] }
    });

    const post = await postsService.createPost('5', 'Anúncio oficial', ['1', '2'], ['8']);
    expect(post?.id).toBe('100');
    expect(graphqlClient.request).toHaveBeenCalledTimes(1);
  });

  it('reactToPost registra reacao no post', async () => {
    (graphqlClient.request as any).mockResolvedValueOnce({
      reactToPost: { id: 'r-1', postId: '100', userId: '5', type: 'LIKE' }
    });

    const reaction = await postsService.reactToPost('100', '5', 'LIKE');
    expect(reaction?.type).toBe('LIKE');
  });

  it('commentOnPost adiciona comentario ao post', async () => {
    (graphqlClient.request as any).mockResolvedValueOnce({
      commentOnPost: { id: 'c-1', postId: '100', authorId: '5', content: 'Excelente iniciativa!' }
    });

    const comment = await postsService.commentOnPost('100', '5', 'Excelente iniciativa!');
    expect(comment?.content).toBe('Excelente iniciativa!');
  });
});
