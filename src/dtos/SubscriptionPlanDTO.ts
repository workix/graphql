export default class SubscriptionPlanDTO {
  id?: number;
  name?: string;
  price?: number;
  billingPeriod?: string;
  inmailCreditsPerMonth?: number;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(plan: any) {
    if (plan) {
      this.id = plan.id;
      this.name = plan.name;
      this.price = plan.price;
      this.billingPeriod = plan.billing_period || plan.billingPeriod;
      this.inmailCreditsPerMonth = plan.inmail_credits_per_month ?? plan.inmailCreditsPerMonth;
      this.createdAt = plan.created_at || plan.createdAt;
      this.updatedAt = plan.updated_at || plan.updatedAt;
    }
  }
}
