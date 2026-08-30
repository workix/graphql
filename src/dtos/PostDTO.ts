export default class PostDTO {
  id?: number;
  authorId?: number;
  content?: string;
  mediaIds?: number[];
  createdAt?: Date;
  updatedAt?: Date;

  constructor(post: any) {
    if (post) {
      this.id = post.id;
      this.authorId = post.author_id || post.authorId;
      this.content = post.content;
      if (post.media_ids) {
        try {
          this.mediaIds = typeof post.media_ids === 'string' ? JSON.parse(post.media_ids) : post.media_ids;
        } catch {
          this.mediaIds = [];
        }
      } else {
        this.mediaIds = post.mediaIds || [];
      }
      this.createdAt = post.created_at || post.createdAt;
      this.updatedAt = post.updated_at || post.updatedAt;
    }
  }
}
