// ============================================================
// Phlobot Billing — Plan tiers, limits, and helpers
// ============================================================

export type PlanTier = 'free' | 'starter' | 'growth' | 'pro';
export type BillingStatus = 'free' | 'active' | 'past_due' | 'cancelled';

export interface Plan {
    id: PlanTier;
    name: string;
    price: number;
    limit: number;
    stripePriceId: string | null;
    description: string;
    features: string[];
}

export const PLANS: Record<PlanTier, Plan> = {
    free: {
        id: 'free',
        name: 'Free Trial',
        price: 0,
        limit: 3,
        stripePriceId: null,
        description: 'Get started with 3 accepted exams — no credit card required.',
        features: [
            '3 lifetime accepted exam matches',
            'SMS examiner matching',
            'Email notifications',
            'No credit card required',
        ],
    },
    starter: {
        id: 'starter',
        name: 'Starter',
        price: 19.99,
        limit: 9,
        stripePriceId: process.env.STRIPE_PRICE_STARTER ?? null,
        description: 'Perfect for advisors with steady exam volume.',
        features: [
            'Up to 9 accepted exams/month',
            'SMS examiner matching',
            'Email notifications',
            'Email support',
        ],
    },
    growth: {
        id: 'growth',
        name: 'Growth',
        price: 49.99,
        limit: 25,
        stripePriceId: process.env.STRIPE_PRICE_GROWTH ?? null,
        description: 'For active advisors scaling their exam volume.',
        features: [
            'Up to 25 accepted exams/month',
            'SMS examiner matching',
            'Email notifications',
            'Priority support',
        ],
    },
    pro: {
        id: 'pro',
        name: 'Pro',
        price: 99.99,
        limit: 50,
        stripePriceId: process.env.STRIPE_PRICE_PRO ?? null,
        description: 'High-volume advisors who need maximum throughput.',
        features: [
            'Up to 50 accepted exams/month',
            'SMS examiner matching',
            'Email notifications',
            'Dedicated support',
        ],
    },
};

export const PLAN_ORDER: PlanTier[] = ['free', 'starter', 'growth', 'pro'];

export const ENTERPRISE_LIMIT = 50;

export function getPlan(tier: string): Plan {
    return PLANS[tier as PlanTier] ?? PLANS.free;
}

export function getPlanLimit(tier: string): number {
    return getPlan(tier).limit;
}

export function isAtLimit(tier: string, jobsThisMonth: number): boolean {
    return jobsThisMonth >= getPlanLimit(tier);
}

export function isAtEnterpriseLimit(tier: string, jobsThisMonth: number): boolean {
    return tier === 'pro' && jobsThisMonth >= ENTERPRISE_LIMIT;
}

export function getPlanLabel(tier: string): string {
    return getPlan(tier).name;
}