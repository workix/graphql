import { describe, it, expect, beforeEach, vi } from 'vitest';
import mediaService from '../media.service';
import graphqlClient from '../graphql';

vi.mock('../graphql', () => ({
  default: {
    request: vi.fn()
  }
}));

describe('mediaService (Client)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('requestUploadUrl solicita url de upload via GraphQL', async () => {
    const mockResponse = {
      requestUploadUrl: {
        mediaAsset: { id: 'asset-1', fileName: 'avatar.png', fileType: 'image/png', context: 'AVATAR', status: 'PENDING' },
        uploadUrl: 'http://localhost:4000/api/v1/media/upload/asset-1'
      }
    };
    (graphqlClient.request as any).mockResolvedValueOnce(mockResponse);

    const result = await mediaService.requestUploadUrl({
      fileName: 'avatar.png',
      fileType: 'image/png',
      context: 'AVATAR'
    });

    expect(result.mediaAsset.id).toBe('asset-1');
    expect(result.uploadUrl).toBe('http://localhost:4000/api/v1/media/upload/asset-1');
    expect(graphqlClient.request).toHaveBeenCalledTimes(1);
  });

  it('confirmUpload confirma asset e retorna estado READY', async () => {
    const mockResponse = {
      confirmUpload: {
        id: 'asset-1',
        fileName: 'avatar.png',
        fileType: 'image/png',
        context: 'AVATAR',
        url: '/uploads/media/avatar.png',
        status: 'READY'
      }
    };
    (graphqlClient.request as any).mockResolvedValueOnce(mockResponse);

    const result = await mediaService.confirmUpload('asset-1');
    expect(result.status).toBe('READY');
    expect(result.url).toBe('/uploads/media/avatar.png');
  });

  it('getMediaById retorna metadados ou null em caso de erro', async () => {
    (graphqlClient.request as any).mockResolvedValueOnce({
      getMediaById: { id: 'asset-1', fileName: 'curriculo.pdf', status: 'READY' }
    });

    const asset = await mediaService.getMediaById('asset-1');
    expect(asset?.fileName).toBe('curriculo.pdf');

    (graphqlClient.request as any).mockRejectedValueOnce(new Error('Asset not found'));
    const notFound = await mediaService.getMediaById('asset-999');
    expect(notFound).toBeNull();
  });

  it('uploadFile realiza fluxo GraphQL completo com fetch binario', async () => {
    const mockFile = new File(['fake-content'], 'foto.jpg', { type: 'image/jpeg' });
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ success: true })
    } as any);

    (graphqlClient.request as any)
      .mockResolvedValueOnce({
        requestUploadUrl: {
          mediaAsset: { id: 'asset-2', fileName: 'foto.jpg', fileType: 'image/jpeg', context: 'AVATAR' },
          uploadUrl: 'http://localhost:4000/api/v1/media/upload/asset-2'
        }
      })
      .mockResolvedValueOnce({
        confirmUpload: { id: 'asset-2', fileName: 'foto.jpg', status: 'READY', url: '/uploads/media/foto.jpg' }
      });

    const result = await mediaService.uploadFile(mockFile, 'AVATAR');
    expect(result.status).toBe('READY');
    expect(global.fetch).toHaveBeenCalled();
  });
});
