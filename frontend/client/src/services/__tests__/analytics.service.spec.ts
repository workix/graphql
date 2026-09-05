import { describe, it, expect, beforeEach, vi } from 'vitest';
import analyticsService from '../analytics.service';
import graphqlClient from '../graphql';

vi.mock('../graphql', () => ({
  default: {
    request: vi.fn()
  }
}));

describe('analyticsService (Client)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getMySocialSellingIndex retorna pontuacao SSI do usuario', async () => {
    (graphqlClient.request as any).mockResolvedValueOnce({
      mySocialSellingIndex: { userId: '10', score: 85, networkScore: 22, postsScore: 23 }
    });

    const ssi = await analyticsService.getMySocialSellingIndex('10');
    expect(ssi?.score).toBe(85);
    expect(ssi?.networkScore).toBe(22);
  });

  it('recalculateSocialSellingIndex dispara recalculacao do score', async () => {
    (graphqlClient.request as any).mockResolvedValueOnce({
      recalculateSocialSellingIndex: { userId: '10', score: 90 }
    });

    const ssi = await analyticsService.recalculateSocialSellingIndex('10');
    expect(ssi?.score).toBe(90);
  });

  it('getWhoViewedMyProfile retorna historico de visualizacoes', async () => {
    (graphqlClient.request as any).mockResolvedValueOnce({
      whoViewedMyProfile: [{ id: '1', viewedId: '10', viewerId: '25', viewedAt: '2026-09-05' }]
    });

    const views = await analyticsService.getWhoViewedMyProfile('10');
    expect(views).toHaveLength(1);
    expect(views[0].viewerId).toBe('25');
  });

  it('getPostAnalytics retorna metricas de visualizacao e compartilhamento', async () => {
    (graphqlClient.request as any).mockResolvedValueOnce({
      postAnalytics: { postId: '100', viewsCount: 1540, sharesCount: 38 }
    });

    const analytics = await analyticsService.getPostAnalytics('100');
    expect(analytics?.viewsCount).toBe(1540);
    expect(analytics?.sharesCount).toBe(38);
  });

  it('recordProfileView e recordPostView registram visualizacoes com sucesso', async () => {
    (graphqlClient.request as any).mockResolvedValue({ id: '1' });

    const profResult = await analyticsService.recordProfileView('10', '20');
    expect(profResult).toBe(true);

    const postResult = await analyticsService.recordPostView('100');
    expect(postResult).toBe(true);
  });
});
