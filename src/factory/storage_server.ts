export interface UploadUrlOptions {
  fileName: string;
  fileType: string;
  context: string;
  assetId?: string | number;
}

export interface UploadUrlResult {
  uploadUrl: string;
  publicUrl: string;
  key: string;
}

export const generatePreSignedUploadUrl = async (options: UploadUrlOptions): Promise<UploadUrlResult> => {
  const endpoint = process.env.STORAGE_ENDPOINT || 'http://localhost:4000';
  const bucket = process.env.STORAGE_BUCKET || 'workix-media';
  
  const timestamp = Date.now();
  const sanitizedFileName = options.fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  const key = `${options.context}/${timestamp}-${sanitizedFileName}`;

  const isCloudStorage = !!process.env.STORAGE_ENDPOINT && !process.env.STORAGE_ENDPOINT.includes('localhost') && !process.env.STORAGE_ENDPOINT.includes('127.0.0.1');

  if (isCloudStorage) {
    const uploadUrl = `${endpoint}/${bucket}/${key}?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Expires=900`;
    const publicUrl = `${endpoint}/${bucket}/${key}`;
    return { uploadUrl, publicUrl, key };
  }

  const appUrl = process.env.APP_URL || `http://localhost:${process.env.PORT || 4000}`;
  const uploadUrl = `${appUrl}/api/v1/media/direct-upload?fileName=${encodeURIComponent(sanitizedFileName)}&context=${encodeURIComponent(options.context)}`;
  const publicUrl = `${appUrl}/uploads/media/${key.replace(/\//g, '-')}`;

  return {
    uploadUrl,
    publicUrl,
    key
  };
};

export const generatePreSignedDownloadUrl = async (key: string): Promise<string> => {
  const endpoint = process.env.STORAGE_ENDPOINT || 'https://storage.workix.com';
  const bucket = process.env.STORAGE_BUCKET || 'workix-media';

  return `${endpoint}/${bucket}/${key}?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Expires=3600`;
};
