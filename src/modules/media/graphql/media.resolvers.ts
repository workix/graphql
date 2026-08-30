import mediaRepository from '../repository/media.repo';
import MediaAssetDTO from '../../../dtos/MediaAssetDTO';

const mediaResolvers = {
  Query: {
    getMediaById: async (parent: any, args: any, ctx: any, info: any) => {
      const media = await mediaRepository(ctx.orm).findById(args);
      return media ? new MediaAssetDTO(media) : null;
    }
  },
  Mutation: {
    requestUploadUrl: async (parent: any, args: any, ctx: any, info: any) => {
      const result = await mediaRepository(ctx.orm).requestUploadUrl(args);
      return {
        mediaAsset: new MediaAssetDTO(result.mediaAsset),
        uploadUrl: result.uploadUrl
      };
    },
    confirmUpload: async (parent: any, args: any, ctx: any, info: any) => {
      const media = await mediaRepository(ctx.orm).confirmUpload(args);
      return new MediaAssetDTO(media);
    }
  }
};

export default mediaResolvers;
