export default class PostCommentDTO {
  id?: number;
  postId?: number;
  authorId?: number;
  content?: string;
  parentId?: number;
  createdAt?: Date;

  constructor(comment: any) {
    if (comment) {
      this.id = comment.id;
      this.postId = comment.post_id || comment.postId;
      this.authorId = comment.author_id || comment.authorId;
      this.content = comment.content;
      this.parentId = comment.parent_id !== undefined ? comment.parent_id : comment.parentId;
      this.createdAt = comment.created_at || comment.createdAt;
    }
  }
}
