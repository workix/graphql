'use strict';

module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    const now = new Date();

    // 1. Insert plans
    await queryInterface.bulkInsert('plans', [
      {
        id: 1,
        code: 'free_v1',
        name: 'Free',
        price_cents: 0,
        currency: 'BRL',
        interval: 'month',
        active: true,
        created_at: now,
        updated_at: now
      },
      {
        id: 2,
        code: 'starter_v1',
        name: 'Starter',
        price_cents: 7900,
        currency: 'BRL',
        interval: 'month',
        active: true,
        created_at: now,
        updated_at: now
      },
      {
        id: 3,
        code: 'pro_v1',
        name: 'Pro',
        price_cents: 24900,
        currency: 'BRL',
        interval: 'month',
        active: true,
        created_at: now,
        updated_at: now
      },
      {
        id: 4,
        code: 'business_v1',
        name: 'Business',
        price_cents: 69900,
        currency: 'BRL',
        interval: 'month',
        active: true,
        created_at: now,
        updated_at: now
      },
      {
        id: 5,
        code: 'candidate_premium_v1',
        name: 'Workix Premium (Candidato)',
        price_cents: 1990,
        currency: 'BRL',
        interval: 'month',
        active: true,
        created_at: now,
        updated_at: now
      }
    ], {});

    // 2. Insert plan features
    await queryInterface.bulkInsert('plan_features', [
      // Free (Plan 1)
      { plan_id: 1, feature_key: 'max_active_jobs', limit_value: 1, enabled: true, created_at: now, updated_at: now },
      { plan_id: 1, feature_key: 'max_users', limit_value: 1, enabled: true, created_at: now, updated_at: now },
      { plan_id: 1, feature_key: 'contact_credits', limit_value: 0, enabled: true, created_at: now, updated_at: now },
      { plan_id: 1, feature_key: 'boost_credits_monthly', limit_value: 0, enabled: true, created_at: now, updated_at: now },
      { plan_id: 1, feature_key: 'has_api', limit_value: 0, enabled: false, created_at: now, updated_at: now },
      { plan_id: 1, feature_key: 'retention_days', limit_value: 60, enabled: true, created_at: now, updated_at: now },

      // Starter (Plan 2)
      { plan_id: 2, feature_key: 'max_active_jobs', limit_value: 3, enabled: true, created_at: now, updated_at: now },
      { plan_id: 2, feature_key: 'max_users', limit_value: 1, enabled: true, created_at: now, updated_at: now },
      { plan_id: 2, feature_key: 'contact_credits', limit_value: 10, enabled: true, created_at: now, updated_at: now },
      { plan_id: 2, feature_key: 'boost_credits_monthly', limit_value: 1, enabled: true, created_at: now, updated_at: now },
      { plan_id: 2, feature_key: 'has_api', limit_value: 0, enabled: false, created_at: now, updated_at: now },
      { plan_id: 2, feature_key: 'retention_days', limit_value: 365, enabled: true, created_at: now, updated_at: now },

      // Pro (Plan 3)
      { plan_id: 3, feature_key: 'max_active_jobs', limit_value: 10, enabled: true, created_at: now, updated_at: now },
      { plan_id: 3, feature_key: 'max_users', limit_value: 3, enabled: true, created_at: now, updated_at: now },
      { plan_id: 3, feature_key: 'contact_credits', limit_value: 60, enabled: true, created_at: now, updated_at: now },
      { plan_id: 3, feature_key: 'boost_credits_monthly', limit_value: 5, enabled: true, created_at: now, updated_at: now },
      { plan_id: 3, feature_key: 'has_api', limit_value: 1, enabled: true, created_at: now, updated_at: now },
      { plan_id: 3, feature_key: 'retention_days', limit_value: 730, enabled: true, created_at: now, updated_at: now },

      // Business (Plan 4)
      { plan_id: 4, feature_key: 'max_active_jobs', limit_value: 30, enabled: true, created_at: now, updated_at: now },
      { plan_id: 4, feature_key: 'max_users', limit_value: 10, enabled: true, created_at: now, updated_at: now },
      { plan_id: 4, feature_key: 'contact_credits', limit_value: 250, enabled: true, created_at: now, updated_at: now },
      { plan_id: 4, feature_key: 'boost_credits_monthly', limit_value: 20, enabled: true, created_at: now, updated_at: now },
      { plan_id: 4, feature_key: 'has_api', limit_value: 1, enabled: true, created_at: now, updated_at: now },
      { plan_id: 4, feature_key: 'retention_days', limit_value: null, enabled: true, created_at: now, updated_at: now },

      // Workix Premium Candidato (Plan 5)
      { plan_id: 5, feature_key: 'contact_credits', limit_value: 5, enabled: true, created_at: now, updated_at: now },
      { plan_id: 5, feature_key: 'profile_boost_enabled', limit_value: 1, enabled: true, created_at: now, updated_at: now },
      { plan_id: 5, feature_key: 'retention_days', limit_value: 365, enabled: true, created_at: now, updated_at: now }
    ], {});
  },

  down: async (queryInterface: any, Sequelize: any) => {
    await queryInterface.bulkDelete('plan_features', null, {});
    await queryInterface.bulkDelete('plans', null, {});
  }
};
