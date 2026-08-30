import { generatePreSignedUploadUrl, generatePreSignedDownloadUrl } from '../../../src/factory/storage_server';

describe('Storage Server Factory Unit Tests (TDD)', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should generate pre-signed upload URL with default bucket and expiration', async () => {
    const result = await generatePreSignedUploadUrl({
      fileName: 'avatar.png',
      fileType: 'image/png',
      context: 'avatar'
    });

    expect(result).toHaveProperty('uploadUrl');
    expect(result).toHaveProperty('publicUrl');
    expect(result).toHaveProperty('key');
    expect(result.uploadUrl).toContain('avatar.png');
    expect(result.key).toContain('avatar/');
  });

  it('should generate pre-signed upload URL with custom env variables', async () => {
    process.env.STORAGE_ENDPOINT = 'https://s3.custom-provider.com';
    process.env.STORAGE_BUCKET = 'custom-bucket';

    const result = await generatePreSignedUploadUrl({
      fileName: 'document.pdf',
      fileType: 'application/pdf',
      context: 'resume_doc'
    });

    expect(result.uploadUrl).toContain('https://s3.custom-provider.com/custom-bucket');
    expect(result.publicUrl).toContain('https://s3.custom-provider.com/custom-bucket');
  });

  it('should generate pre-signed download URL', async () => {
    const downloadUrl = await generatePreSignedDownloadUrl('avatar/12345-avatar.png');
    expect(downloadUrl).toContain('avatar/12345-avatar.png');
  });
});
