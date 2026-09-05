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

  it('getSocialFeed retorna lista de posts do usuario com agregados de likes e autor', async () => {
    const mockPosts = [
      {
        id: '1',
        authorId: '10',
        author: { name: 'Lucas Dev', role: 'Dev Senior', photoUrl: 'http://photo.jpg' },
        content: 'Novo artigo publicado!',
        mediaIds: [],
        reactionsCount: 15,
        commentsCount: 4,
        userReaction: 'LIKE'
      }
    ];
    (graphqlClient.request as any).mockResolvedValueOnce({ socialFeed: mockPosts });

    const feed = await postsService.getSocialFeed('10', 20, 0);
    expect(feed).toHaveLength(1);
    expect(feed[0].content).toBe('Novo artigo publicado!');
    expect(feed[0].authorName).toBe('Lucas Dev');
    expect(feed[0].reactionsCount).toBe(15);
    expect(feed[0].userReaction).toBe('LIKE');
  });

  it('getRankedSocialFeed retorna feed ordenado ou faz fallback para getSocialFeed', async () => {
    (graphqlClient.request as any).mockRejectedValueOnce(new Error('Ranked feed unavailable'));
    (graphqlClient.request as any).mockResolvedValueOnce({
      socialFeed: [{ id: '2', authorId: '10', content: 'Fallback post', reactionsCount: 2 }]
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

  it('commentOnPost adiciona comentario ao post com parentId opcional para respostas', async () => {
    (graphqlClient.request as any).mockResolvedValueOnce({
      commentOnPost: { id: 'c-1', postId: '100', authorId: '5', content: 'Excelente iniciativa!', parentId: 'c-0' }
    });

    const comment = await postsService.commentOnPost('100', '5', 'Excelente iniciativa!', 'c-0');
    expect(comment?.content).toBe('Excelente iniciativa!');
    expect(comment?.parentId).toBe('c-0');
  });

  it('getPostComments organiza arvore de comentarios pais e filhos', async () => {
    (graphqlClient.request as any).mockResolvedValueOnce({
      postComments: [
        { id: '1', postId: '100', authorId: '5', content: 'Comentário Pai', parentId: null, replies: [] },
        { id: '2', postId: '100', authorId: '8', content: 'Comentário Filho', parentId: '1', replies: [] }
      ]
    });

    const comments = await postsService.getPostComments('100');
    expect(comments).toHaveLength(1);
    expect(comments[0].content).toBe('Comentário Pai');
    expect(comments[0].replies).toHaveLength(1);
    expect(comments[0].replies![0].content).toBe('Comentário Filho');
  });
});
