import { describe, it, expect, beforeEach, vi } from 'vitest';
import mediaAdminService from '../mediaAdmin.service';
import graphqlClient from '../graphql';

vi.mock('../graphql', () => ({
  default: {
    request: vi.fn()
  }
}));

describe('mediaAdminService (Admin)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getMediaList retorna lista de assets de midia cadastrados no sistema', async () => {
    const mockAssets = [
      { id: '1', fileName: 'profile.jpg', fileType: 'image/jpeg', context: 'AVATAR', status: 'READY', url: '/uploads/media/profile.jpg' }
    ];
    (graphqlClient.request as any).mockResolvedValueOnce({ allMediaAssets: mockAssets });

    const list = await mediaAdminService.getMediaList(50, 0);
    expect(list).toHaveLength(1);
    expect(list[0].fileName).toBe('profile.jpg');
    expect(list[0].status).toBe('READY');
  });

  it('getMediaList retorna array vazio em caso de falha', async () => {
    (graphqlClient.request as any).mockRejectedValueOnce(new Error('Network error'));

    const list = await mediaAdminService.getMediaList();
    expect(list).toEqual([]);
  });
});
