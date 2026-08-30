export default class RecommendationDTO {
  id?: number;
  recommenderId?: number;
  recipientId?: number;
  content?: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(rec: any) {
    if (rec) {
      this.id = rec.id;
      this.recommenderId = rec.recommender_id || rec.recommenderId;
      this.recipientId = rec.recipient_id || rec.recipientId;
      this.content = rec.content;
      this.status = rec.status;
      this.createdAt = rec.created_at || rec.createdAt;
      this.updatedAt = rec.updated_at || rec.updatedAt;
    }
  }
}
