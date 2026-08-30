export default class MediaAssetDTO {
  id?: number;
  fileName?: string;
  fileType?: string;
  context?: string;
  url?: string;
  status?: string;
  userId?: number;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(media: any) {
    if (media) {
      this.id = media.id;
      this.fileName = media.file_name || media.fileName;
      this.fileType = media.file_type || media.fileType;
      this.context = media.context;
      this.url = media.url;
      this.status = media.status;
      this.userId = media.user_id || media.userId;
      this.createdAt = media.created_at || media.createdAt;
      this.updatedAt = media.updated_at || media.updatedAt;
    }
  }
}
