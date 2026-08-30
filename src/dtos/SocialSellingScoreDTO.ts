export default class SocialSellingScoreDTO {
  id?: number;
  userId?: number;
  score?: number;
  postsScore?: number;
  networkScore?: number;
  engagementScore?: number;
  relationshipsScore?: number;
  calculatedAt?: Date;

  constructor(entry: any) {
    if (entry) {
      this.id = entry.id;
      this.userId = entry.user_id || entry.userId;
      this.score = entry.score;
      this.postsScore = entry.posts_score ?? entry.postsScore;
      this.networkScore = entry.network_score ?? entry.networkScore;
      this.engagementScore = entry.engagement_score ?? entry.engagementScore;
      this.relationshipsScore = entry.relationships_score ?? entry.relationshipsScore;
      this.calculatedAt = entry.calculated_at || entry.calculatedAt;
    }
  }
}
