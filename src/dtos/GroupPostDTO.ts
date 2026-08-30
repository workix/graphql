export default class GroupPostDTO {
  id?: number;
  groupId?: number;
  authorId?: number;
  content?: string;
  createdAt?: Date;

  constructor(post: any) {
    if (post) {
      this.id = post.id;
      this.groupId = post.group_id || post.groupId;
      this.authorId = post.author_id || post.authorId;
      this.content = post.content;
      this.createdAt = post.created_at || post.createdAt;
    }
  }
}
