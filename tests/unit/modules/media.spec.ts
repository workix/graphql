import mediaResolvers from '../../../src/modules/media/graphql/media.resolvers';
import mediaRepository from '../../../src/modules/media/repository/media.repo';
import MediaAssetDTO from '../../../src/dtos/MediaAssetDTO';
import { MediaAsset } from '../../../src/models';

jest.mock('../../../src/models', () => ({
  MediaAsset: {
    create: jest.fn(),
    findByPk: jest.fn()
  }
}));

describe('Media Module Unit Tests (TDD)', () => {
  let mockCtx: any;

  beforeEach(() => {
    mockCtx = {
      orm: {}
    };
  });

  describe('mediaRepository', () => {
    it('should request upload URL and create PENDING MediaAsset', async () => {
      const mockAsset = {
        id: 1,
        file_name: 'photo.jpg',
        file_type: 'image/jpeg',
        context: 'avatar',
        url: 'https://storage.workix.com/workix-media/avatar/photo.jpg',
        status: 'PENDING',
        user_id: 10
      };
      (MediaAsset.create as jest.Mock).mockResolvedValue(mockAsset);

      const repo = mediaRepository(mockCtx.orm);
      const result = await repo.requestUploadUrl({
        input: { fileName: 'photo.jpg', fileType: 'image/jpeg', context: 'avatar', userId: 10 }
      });

      expect(result.mediaAsset).toEqual(mockAsset);
      expect(result.uploadUrl).toContain('photo.jpg');
      expect(MediaAsset.create).toHaveBeenCalledWith(expect.objectContaining({
        file_name: 'photo.jpg',
        status: 'PENDING'
      }));
    });

    it('should confirm upload status to CONFIRMED', async () => {
      const mockUpdate = jest.fn().mockResolvedValue(true);
      const mockAsset = {
        id: 1,
        status: 'PENDING',
        update: mockUpdate
      };
      (MediaAsset.findByPk as jest.Mock).mockResolvedValue(mockAsset);

      const repo = mediaRepository(mockCtx.orm);
      const result = await repo.confirmUpload({ id: 1 });

      expect(MediaAsset.findByPk).toHaveBeenCalledWith(1);
      expect(mockUpdate).toHaveBeenCalledWith({ status: 'CONFIRMED' });
    });

    it('should throw error on confirmUpload if media asset not found', async () => {
      (MediaAsset.findByPk as jest.Mock).mockResolvedValue(null);

      const repo = mediaRepository(mockCtx.orm);
      await expect(repo.confirmUpload({ id: 999 })).rejects.toThrow('MediaAsset with id 999 not found');
    });

    it('should find media asset by id', async () => {
      const mockAsset = { id: 1, file_name: 'photo.jpg' };
      (MediaAsset.findByPk as jest.Mock).mockResolvedValue(mockAsset);

      const repo = mediaRepository(mockCtx.orm);
      const result = await repo.findById({ id: 1 });

      expect(result).toEqual(mockAsset);
    });
  });

  describe('mediaResolvers', () => {
    it('should execute getMediaById, requestUploadUrl and confirmUpload resolvers', async () => {
      const mockAsset = {
        id: 1,
        file_name: 'banner.png',
        file_type: 'image/png',
        context: 'banner',
        url: 'https://storage.workix.com/banner.png',
        status: 'CONFIRMED',
        user_id: 5,
        update: jest.fn().mockResolvedValue(true)
      };
      (MediaAsset.create as jest.Mock).mockResolvedValue(mockAsset);
      (MediaAsset.findByPk as jest.Mock).mockResolvedValue(mockAsset);

      const q = mediaResolvers.Query;
      const m = mediaResolvers.Mutation;

      const mediaDto = await q.getMediaById(null, { id: 1 }, mockCtx, {});
      expect(mediaDto).toBeInstanceOf(MediaAssetDTO);

      const uploadRes = await m.requestUploadUrl(null, { input: { fileName: 'banner.png', fileType: 'image/png', context: 'banner' } }, mockCtx, {});
      expect(uploadRes.uploadUrl).toBeDefined();

      const confirmedDto = await m.confirmUpload(null, { id: 1 }, mockCtx, {});
      expect(confirmedDto).toBeInstanceOf(MediaAssetDTO);
    });

    it('should return null for getMediaById when asset is missing', async () => {
      (MediaAsset.findByPk as jest.Mock).mockResolvedValue(null);
      const q = mediaResolvers.Query;

      const result = await q.getMediaById(null, { id: 99 }, mockCtx, {});
      expect(result).toBeNull();
    });
  });

  describe('MediaAssetDTO', () => {
    it('should handle undefined input', () => {
      const dto = new MediaAssetDTO(null);
      expect(dto.id).toBeUndefined();
    });
  });
});
