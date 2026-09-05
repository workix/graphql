'use strict';

module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    const now = new Date();

    // 1. Insert plans
    await queryInterface.bulkInsert('plans', [
      {
        id: 1,
        code: 'free_v1',
        name: 'Plano Gratuito Empresa',
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
        name: 'Workix Starter (Empresas)',
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
        name: 'Workix Pro (Empresas)',
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
        name: 'Workix Business (Empresas)',
        price_cents: 69900,
        currency: 'BRL',
        interval: 'month',
        active: true,
        created_at: now,
        updated_at: now
      },
      {
        id: 5,
        code: 'candidate_free_v1',
        name: 'Workix Free (Candidato)',
        price_cents: 0,
        currency: 'BRL',
        interval: 'month',
        active: true,
        created_at: now,
        updated_at: now
      },
      {
        id: 6,
        code: 'candidate_premium_v1',
        name: 'Workix Premium Mensal (Candidato)',
        price_cents: 1990,
        currency: 'BRL',
        interval: 'month',
        active: true,
        created_at: now,
        updated_at: now
      },
      {
        id: 7,
        code: 'candidate_premium_annual_v1',
        name: 'Workix Premium Anual (Candidato)',
        price_cents: 19900,
        currency: 'BRL',
        interval: 'year',
        active: true,
        created_at: now,
        updated_at: now
      }
    ], {});

    // 2. Insert plan features
    await queryInterface.bulkInsert('plan_features', [
      // Free Empresa (Plan 1)
      { plan_id: 1, feature_key: 'max_active_jobs', limit_value: 1, enabled: true, created_at: now, updated_at: now },
      { plan_id: 1, feature_key: 'max_users', limit_value: 1, enabled: true, created_at: now, updated_at: now },
      { plan_id: 1, feature_key: 'contact_credits', limit_value: 0, enabled: true, created_at: now, updated_at: now },
      { plan_id: 1, feature_key: 'boost_credits_monthly', limit_value: 0, enabled: true, created_at: now, updated_at: now },
      { plan_id: 1, feature_key: 'has_api', limit_value: 0, enabled: false, created_at: now, updated_at: now },
      { plan_id: 1, feature_key: 'retention_days', limit_value: 60, enabled: true, created_at: now, updated_at: now },
      { plan_id: 1, feature_key: 'USE_RECRUITMENT_KANBAN', limit_value: 0, enabled: false, created_at: now, updated_at: now },
      { plan_id: 1, feature_key: 'recruitment_kanban', limit_value: 0, enabled: false, created_at: now, updated_at: now },
      { plan_id: 1, feature_key: 'POST_CONFIDENTIAL_JOBS', limit_value: 0, enabled: false, created_at: now, updated_at: now },
      { plan_id: 1, feature_key: 'confidential_jobs', limit_value: 0, enabled: false, created_at: now, updated_at: now },
      { plan_id: 1, feature_key: 'SCHEDULE_INTERVIEWS', limit_value: 0, enabled: false, created_at: now, updated_at: now },
      { plan_id: 1, feature_key: 'interview_scheduler', limit_value: 0, enabled: false, created_at: now, updated_at: now },
      { plan_id: 1, feature_key: 'VIEW_CANDIDATE_ACTIVE_PROCESSES', limit_value: 0, enabled: false, created_at: now, updated_at: now },
      { plan_id: 1, feature_key: 'candidate_active_processes', limit_value: 0, enabled: false, created_at: now, updated_at: now },
      { plan_id: 1, feature_key: 'CREATE_LMS_COURSES', limit_value: 0, enabled: false, created_at: now, updated_at: now },
      { plan_id: 1, feature_key: 'MANAGE_GROUPS', limit_value: 0, enabled: false, created_at: now, updated_at: now },

      // Starter Empresa (Plan 2)
      { plan_id: 2, feature_key: 'max_active_jobs', limit_value: 3, enabled: true, created_at: now, updated_at: now },
      { plan_id: 2, feature_key: 'max_users', limit_value: 1, enabled: true, created_at: now, updated_at: now },
      { plan_id: 2, feature_key: 'contact_credits', limit_value: 10, enabled: true, created_at: now, updated_at: now },
      { plan_id: 2, feature_key: 'boost_credits_monthly', limit_value: 1, enabled: true, created_at: now, updated_at: now },
      { plan_id: 2, feature_key: 'has_api', limit_value: 0, enabled: false, created_at: now, updated_at: now },
      { plan_id: 2, feature_key: 'retention_days', limit_value: 365, enabled: true, created_at: now, updated_at: now },
      { plan_id: 2, feature_key: 'USE_RECRUITMENT_KANBAN', limit_value: 1, enabled: true, created_at: now, updated_at: now },
      { plan_id: 2, feature_key: 'recruitment_kanban', limit_value: 1, enabled: true, created_at: now, updated_at: now },
      { plan_id: 2, feature_key: 'POST_CONFIDENTIAL_JOBS', limit_value: 1, enabled: true, created_at: now, updated_at: now },
      { plan_id: 2, feature_key: 'confidential_jobs', limit_value: 1, enabled: true, created_at: now, updated_at: now },
      { plan_id: 2, feature_key: 'SCHEDULE_INTERVIEWS', limit_value: 1, enabled: true, created_at: now, updated_at: now },
      { plan_id: 2, feature_key: 'interview_scheduler', limit_value: 1, enabled: true, created_at: now, updated_at: now },
      { plan_id: 2, feature_key: 'VIEW_CANDIDATE_ACTIVE_PROCESSES', limit_value: 1, enabled: true, created_at: now, updated_at: now },
      { plan_id: 2, feature_key: 'candidate_active_processes', limit_value: 1, enabled: true, created_at: now, updated_at: now },
      { plan_id: 2, feature_key: 'CREATE_LMS_COURSES', limit_value: 0, enabled: false, created_at: now, updated_at: now },
      { plan_id: 2, feature_key: 'MANAGE_GROUPS', limit_value: 1, enabled: true, created_at: now, updated_at: now },

      // Pro Empresa (Plan 3)
      { plan_id: 3, feature_key: 'max_active_jobs', limit_value: 10, enabled: true, created_at: now, updated_at: now },
      { plan_id: 3, feature_key: 'max_users', limit_value: 3, enabled: true, created_at: now, updated_at: now },
      { plan_id: 3, feature_key: 'contact_credits', limit_value: 60, enabled: true, created_at: now, updated_at: now },
      { plan_id: 3, feature_key: 'boost_credits_monthly', limit_value: 5, enabled: true, created_at: now, updated_at: now },
      { plan_id: 3, feature_key: 'has_api', limit_value: 1, enabled: true, created_at: now, updated_at: now },
      { plan_id: 3, feature_key: 'retention_days', limit_value: 730, enabled: true, created_at: now, updated_at: now },
      { plan_id: 3, feature_key: 'USE_RECRUITMENT_KANBAN', limit_value: 1, enabled: true, created_at: now, updated_at: now },
      { plan_id: 3, feature_key: 'recruitment_kanban', limit_value: 1, enabled: true, created_at: now, updated_at: now },
      { plan_id: 3, feature_key: 'POST_CONFIDENTIAL_JOBS', limit_value: 1, enabled: true, created_at: now, updated_at: now },
      { plan_id: 3, feature_key: 'confidential_jobs', limit_value: 1, enabled: true, created_at: now, updated_at: now },
      { plan_id: 3, feature_key: 'SCHEDULE_INTERVIEWS', limit_value: 1, enabled: true, created_at: now, updated_at: now },
      { plan_id: 3, feature_key: 'interview_scheduler', limit_value: 1, enabled: true, created_at: now, updated_at: now },
      { plan_id: 3, feature_key: 'VIEW_CANDIDATE_ACTIVE_PROCESSES', limit_value: 1, enabled: true, created_at: now, updated_at: now },
      { plan_id: 3, feature_key: 'candidate_active_processes', limit_value: 1, enabled: true, created_at: now, updated_at: now },
      { plan_id: 3, feature_key: 'CREATE_LMS_COURSES', limit_value: 1, enabled: true, created_at: now, updated_at: now },
      { plan_id: 3, feature_key: 'MANAGE_GROUPS', limit_value: 1, enabled: true, created_at: now, updated_at: now },

      // Business Empresa (Plan 4)
      { plan_id: 4, feature_key: 'max_active_jobs', limit_value: 30, enabled: true, created_at: now, updated_at: now },
      { plan_id: 4, feature_key: 'max_users', limit_value: 10, enabled: true, created_at: now, updated_at: now },
      { plan_id: 4, feature_key: 'contact_credits', limit_value: 250, enabled: true, created_at: now, updated_at: now },
      { plan_id: 4, feature_key: 'boost_credits_monthly', limit_value: 20, enabled: true, created_at: now, updated_at: now },
      { plan_id: 4, feature_key: 'has_api', limit_value: 1, enabled: true, created_at: now, updated_at: now },
      { plan_id: 4, feature_key: 'retention_days', limit_value: null, enabled: true, created_at: now, updated_at: now },
      { plan_id: 4, feature_key: 'USE_RECRUITMENT_KANBAN', limit_value: 1, enabled: true, created_at: now, updated_at: now },
      { plan_id: 4, feature_key: 'recruitment_kanban', limit_value: 1, enabled: true, created_at: now, updated_at: now },
      { plan_id: 4, feature_key: 'POST_CONFIDENTIAL_JOBS', limit_value: 1, enabled: true, created_at: now, updated_at: now },
      { plan_id: 4, feature_key: 'confidential_jobs', limit_value: 1, enabled: true, created_at: now, updated_at: now },
      { plan_id: 4, feature_key: 'SCHEDULE_INTERVIEWS', limit_value: 1, enabled: true, created_at: now, updated_at: now },
      { plan_id: 4, feature_key: 'interview_scheduler', limit_value: 1, enabled: true, created_at: now, updated_at: now },
      { plan_id: 4, feature_key: 'VIEW_CANDIDATE_ACTIVE_PROCESSES', limit_value: 1, enabled: true, created_at: now, updated_at: now },
      { plan_id: 4, feature_key: 'candidate_active_processes', limit_value: 1, enabled: true, created_at: now, updated_at: now },
      { plan_id: 4, feature_key: 'CREATE_LMS_COURSES', limit_value: 1, enabled: true, created_at: now, updated_at: now },
      { plan_id: 4, feature_key: 'MANAGE_GROUPS', limit_value: 1, enabled: true, created_at: now, updated_at: now },

      // Free Candidato (Plan 5)
      { plan_id: 5, feature_key: 'contact_credits', limit_value: 0, enabled: true, created_at: now, updated_at: now },
      { plan_id: 5, feature_key: 'profile_boost_enabled', limit_value: 0, enabled: false, created_at: now, updated_at: now },
      { plan_id: 5, feature_key: 'retention_days', limit_value: 7, enabled: true, created_at: now, updated_at: now },
      { plan_id: 5, feature_key: 'VIEW_DETAILED_PROFILE_ANALYTICS', limit_value: 0, enabled: false, created_at: now, updated_at: now },
      { plan_id: 5, feature_key: 'view_detailed_profile_analytics', limit_value: 0, enabled: false, created_at: now, updated_at: now },
      { plan_id: 5, feature_key: 'SEARCH_APPEARANCES_TRACKING', limit_value: 0, enabled: false, created_at: now, updated_at: now },
      { plan_id: 5, feature_key: 'search_appearances_tracking', limit_value: 0, enabled: false, created_at: now, updated_at: now },
      { plan_id: 5, feature_key: 'ACCESS_ALL_LMS_COURSES', limit_value: 0, enabled: false, created_at: now, updated_at: now },
      { plan_id: 5, feature_key: 'access_all_lms_courses', limit_value: 0, enabled: false, created_at: now, updated_at: now },
      { plan_id: 5, feature_key: 'SSI_DIAGNOSTIC_REPORT', limit_value: 0, enabled: false, created_at: now, updated_at: now },
      { plan_id: 5, feature_key: 'ssi_diagnostic_report', limit_value: 0, enabled: false, created_at: now, updated_at: now },
      { plan_id: 5, feature_key: 'ACTIVE_PROCESSES_PRIVACY_CONTROL', limit_value: 1, enabled: true, created_at: now, updated_at: now },
      { plan_id: 5, feature_key: 'active_processes_privacy_control', limit_value: 1, enabled: true, created_at: now, updated_at: now },
      { plan_id: 5, feature_key: 'INTERVIEW_JAAS_ACCESS', limit_value: 0, enabled: false, created_at: now, updated_at: now },
      { plan_id: 5, feature_key: 'MARKDOWN_RESUME_AI_SCORE', limit_value: 0, enabled: false, created_at: now, updated_at: now },

      // Premium Candidato Mensal (Plan 6)
      { plan_id: 6, feature_key: 'contact_credits', limit_value: 5, enabled: true, created_at: now, updated_at: now },
      { plan_id: 6, feature_key: 'profile_boost_enabled', limit_value: 1, enabled: true, created_at: now, updated_at: now },
      { plan_id: 6, feature_key: 'retention_days', limit_value: 365, enabled: true, created_at: now, updated_at: now },
      { plan_id: 6, feature_key: 'VIEW_DETAILED_PROFILE_ANALYTICS', limit_value: 1, enabled: true, created_at: now, updated_at: now },
      { plan_id: 6, feature_key: 'view_detailed_profile_analytics', limit_value: 1, enabled: true, created_at: now, updated_at: now },
      { plan_id: 6, feature_key: 'SEARCH_APPEARANCES_TRACKING', limit_value: 1, enabled: true, created_at: now, updated_at: now },
      { plan_id: 6, feature_key: 'search_appearances_tracking', limit_value: 1, enabled: true, created_at: now, updated_at: now },
      { plan_id: 6, feature_key: 'ACCESS_ALL_LMS_COURSES', limit_value: 1, enabled: true, created_at: now, updated_at: now },
      { plan_id: 6, feature_key: 'access_all_lms_courses', limit_value: 1, enabled: true, created_at: now, updated_at: now },
      { plan_id: 6, feature_key: 'SSI_DIAGNOSTIC_REPORT', limit_value: 1, enabled: true, created_at: now, updated_at: now },
      { plan_id: 6, feature_key: 'ssi_diagnostic_report', limit_value: 1, enabled: true, created_at: now, updated_at: now },
      { plan_id: 6, feature_key: 'ACTIVE_PROCESSES_PRIVACY_CONTROL', limit_value: 1, enabled: true, created_at: now, updated_at: now },
      { plan_id: 6, feature_key: 'active_processes_privacy_control', limit_value: 1, enabled: true, created_at: now, updated_at: now },
      { plan_id: 6, feature_key: 'INTERVIEW_JAAS_ACCESS', limit_value: 1, enabled: true, created_at: now, updated_at: now },
      { plan_id: 6, feature_key: 'MARKDOWN_RESUME_AI_SCORE', limit_value: 1, enabled: true, created_at: now, updated_at: now },

      // Premium Candidato Anual (Plan 7)
      { plan_id: 7, feature_key: 'contact_credits', limit_value: 5, enabled: true, created_at: now, updated_at: now },
      { plan_id: 7, feature_key: 'profile_boost_enabled', limit_value: 1, enabled: true, created_at: now, updated_at: now },
      { plan_id: 7, feature_key: 'retention_days', limit_value: 365, enabled: true, created_at: now, updated_at: now },
      { plan_id: 7, feature_key: 'VIEW_DETAILED_PROFILE_ANALYTICS', limit_value: 1, enabled: true, created_at: now, updated_at: now },
      { plan_id: 7, feature_key: 'view_detailed_profile_analytics', limit_value: 1, enabled: true, created_at: now, updated_at: now },
      { plan_id: 7, feature_key: 'SEARCH_APPEARANCES_TRACKING', limit_value: 1, enabled: true, created_at: now, updated_at: now },
      { plan_id: 7, feature_key: 'search_appearances_tracking', limit_value: 1, enabled: true, created_at: now, updated_at: now },
      { plan_id: 7, feature_key: 'ACCESS_ALL_LMS_COURSES', limit_value: 1, enabled: true, created_at: now, updated_at: now },
      { plan_id: 7, feature_key: 'access_all_lms_courses', limit_value: 1, enabled: true, created_at: now, updated_at: now },
      { plan_id: 7, feature_key: 'SSI_DIAGNOSTIC_REPORT', limit_value: 1, enabled: true, created_at: now, updated_at: now },
      { plan_id: 7, feature_key: 'ssi_diagnostic_report', limit_value: 1, enabled: true, created_at: now, updated_at: now },
      { plan_id: 7, feature_key: 'ACTIVE_PROCESSES_PRIVACY_CONTROL', limit_value: 1, enabled: true, created_at: now, updated_at: now },
      { plan_id: 7, feature_key: 'active_processes_privacy_control', limit_value: 1, enabled: true, created_at: now, updated_at: now },
      { plan_id: 7, feature_key: 'INTERVIEW_JAAS_ACCESS', limit_value: 1, enabled: true, created_at: now, updated_at: now },
      { plan_id: 7, feature_key: 'MARKDOWN_RESUME_AI_SCORE', limit_value: 1, enabled: true, created_at: now, updated_at: now }
    ], {});
  },

  down: async (queryInterface: any, Sequelize: any) => {
    await queryInterface.bulkDelete('plan_features', null, {});
    await queryInterface.bulkDelete('plans', null, {});
  }
};
