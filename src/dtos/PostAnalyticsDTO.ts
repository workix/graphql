export default class PostAnalyticsDTO {
  id?: number;
  postId?: number;
  viewsCount?: number;
  sharesCount?: number;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(analytics: any) {
    if (analytics) {
      this.id = analytics.id;
      this.postId = analytics.post_id || analytics.postId;
      this.viewsCount = analytics.views_count ?? analytics.viewsCount;
      this.sharesCount = analytics.shares_count ?? analytics.sharesCount;
      this.createdAt = analytics.created_at || analytics.createdAt;
      this.updatedAt = analytics.updated_at || analytics.updatedAt;
    }
  }
}
