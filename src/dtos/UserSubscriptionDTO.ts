export default class UserSubscriptionDTO {
  id?: number;
  userId?: number;
  planId?: number;
  status?: string;
  inmailCreditsRemaining?: number;
  startedAt?: Date;
  expiresAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(subscription: any) {
    if (subscription) {
      this.id = subscription.id;
      this.userId = subscription.user_id || subscription.userId;
      this.planId = subscription.plan_id || subscription.planId;
      this.status = subscription.status;
      this.inmailCreditsRemaining = subscription.inmail_credits_remaining ?? subscription.inmailCreditsRemaining;
      this.startedAt = subscription.started_at || subscription.startedAt;
      this.expiresAt = subscription.expires_at || subscription.expiresAt;
      this.createdAt = subscription.created_at || subscription.createdAt;
      this.updatedAt = subscription.updated_at || subscription.updatedAt;
    }
  }
}
