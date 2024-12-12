export interface SubscriptionPlan {
  name: string;
  credits: number;
  used: number;
}

export interface UserSubscription {
  plan: SubscriptionPlan;
  nextBillingDate?: string;
  status: 'active' | 'inactive' | 'cancelled';
} 