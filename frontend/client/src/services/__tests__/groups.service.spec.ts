import { describe, it, expect, beforeEach, vi } from 'vitest';
import groupsService from '../groups.service';
import graphqlClient from '../graphql';

vi.mock('../graphql', () => ({
  default: {
    request: vi.fn()
  }
}));

describe('groupsService (Client)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getGroup retorna informacoes de comunidade', async () => {
    (graphqlClient.request as any).mockResolvedValueOnce({
      group: { id: '1', name: 'Comunidade Vue Brasil', privacy: 'PUBLIC', ownerId: '10' }
    });

    const group = await groupsService.getGroup('1');
    expect(group?.name).toBe('Comunidade Vue Brasil');
  });

  it('getGroupPosts lista postagens do grupo', async () => {
    (graphqlClient.request as any).mockResolvedValueOnce({
      groupPosts: [{ id: 'p-1', groupId: '1', authorId: '10', content: 'Dica do dia sobre Pinia' }]
    });

    const posts = await groupsService.getGroupPosts('1');
    expect(posts).toHaveLength(1);
    expect(posts[0].content).toBe('Dica do dia sobre Pinia');
  });

  it('createGroup cria nova comunidade', async () => {
    (graphqlClient.request as any).mockResolvedValueOnce({
      createGroup: { id: '2', name: 'DevOps Latam', ownerId: '5' }
    });

    const group = await groupsService.createGroup('5', 'DevOps Latam', 'Grupo de DevOps');
    expect(group?.id).toBe('2');
  });

  it('joinGroup solicita entrada no grupo', async () => {
    (graphqlClient.request as any).mockResolvedValueOnce({
      joinGroup: { id: 'm-1', groupId: '2', userId: '15', status: 'PENDING' }
    });

    const membership = await groupsService.joinGroup('2', '15');
    expect(membership?.status).toBe('PENDING');
  });

  it('createGroupPost publica no mural do grupo', async () => {
    (graphqlClient.request as any).mockResolvedValueOnce({
      createGroupPost: { id: 'gp-1', groupId: '2', authorId: '15', content: 'Olá a todos!' }
    });

    const post = await groupsService.createGroupPost('2', '15', 'Olá a todos!');
    expect(post?.content).toBe('Olá a todos!');
  });
});
