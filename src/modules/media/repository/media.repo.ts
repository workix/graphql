import { MediaAsset } from '../../../models';
import { generatePreSignedUploadUrl } from '../../../factory/storage_server';

const mediaRepository = (db: any) => {
  const requestUploadUrl = async (args: any) => {
    const { fileName, fileType, context, userId } = args.input;
    const storageResult = await generatePreSignedUploadUrl({ fileName, fileType, context });

    const mediaAsset = await MediaAsset.create({
      file_name: fileName,
      file_type: fileType,
      context,
      url: storageResult.publicUrl,
      status: 'PENDING',
      user_id: userId || null
    });

    return {
      mediaAsset,
      uploadUrl: storageResult.uploadUrl
    };
  };

  const confirmUpload = async (args: any) => {
    const mediaAsset = await MediaAsset.findByPk(args.id);
    if (!mediaAsset) {
      throw new Error(`MediaAsset with id ${args.id} not found`);
    }

    await mediaAsset.update({ status: 'CONFIRMED' });
    return mediaAsset;
  };

  const findById = async (args: any) => {
    const mediaAsset = await MediaAsset.findByPk(args.id);
    return mediaAsset;
  };

  return { requestUploadUrl, confirmUpload, findById };
};

export default mediaRepository;
