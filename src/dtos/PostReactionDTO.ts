export default class PostReactionDTO {
  id?: number;
  postId?: number;
  userId?: number;
  type?: string;
  createdAt?: Date;

  constructor(reaction: any) {
    if (reaction) {
      this.id = reaction.id;
      this.postId = reaction.post_id || reaction.postId;
      this.userId = reaction.user_id || reaction.userId;
      this.type = reaction.type;
      this.createdAt = reaction.created_at || reaction.createdAt;
    }
  }
}
