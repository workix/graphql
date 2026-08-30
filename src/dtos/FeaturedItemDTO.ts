export default class FeaturedItemDTO {
  id?: number;
  userId?: number;
  type?: string;
  title?: string;
  url?: string;
  mediaId?: number;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(item: any) {
    if (item) {
      this.id = item.id;
      this.userId = item.user_id || item.userId;
      this.type = item.type;
      this.title = item.title;
      this.url = item.url;
      this.mediaId = item.media_id || item.mediaId;
      this.createdAt = item.created_at || item.createdAt;
      this.updatedAt = item.updated_at || item.updatedAt;
    }
  }
}
