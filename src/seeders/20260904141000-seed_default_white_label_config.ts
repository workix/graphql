'use strict';

module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    const now = new Date();

    await queryInterface.bulkInsert('white_label_configs', [
      {
        id: 1,
        slug: 'default',
        name: 'Workix Default',
        custom_domain: null,
        logo_url: '/assets/branding/workix-logo.svg',
        logo_dark_url: '/assets/branding/workix-logo-dark.svg',
        favicon_url: '/favicon.ico',
        primary_color: '#0A66C2',
        secondary_color: '#004182',
        accent_color: '#70B5F9',
        background_color: '#F3F2EF',
        text_color: '#191919',
        font_family: 'Inter, -apple-system, system-ui, sans-serif',
        app_title: 'Workix - Portal de Vagas e Carreiras',
        meta_description: 'A maior plataforma profissional e rede de empregos e talentos da América Latina.',
        institutional_links: JSON.stringify({
          about_url: 'https://workix.com/about',
          terms_url: 'https://workix.com/terms',
          privacy_url: 'https://workix.com/privacy',
          help_url: 'https://workix.com/help'
        }),
        custom_css: null,
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        id: 2,
        slug: 'techcorp',
        name: 'TechCorp Careers',
        custom_domain: 'careers.techcorp.io',
        logo_url: 'https://cdn.techcorp.io/brand/logo.svg',
        logo_dark_url: 'https://cdn.techcorp.io/brand/logo-dark.svg',
        favicon_url: 'https://cdn.techcorp.io/brand/favicon.ico',
        primary_color: '#6366F1',
        secondary_color: '#4F46E5',
        accent_color: '#A5B4FC',
        background_color: '#0F172A',
        text_color: '#F8FAFC',
        font_family: 'Roboto, sans-serif',
        app_title: 'TechCorp - Portal Oficial de Carreiras',
        meta_description: 'Faça parte da revolução tecnológica. Conheça as vagas e desafios na TechCorp.',
        institutional_links: JSON.stringify({
          about_url: 'https://techcorp.io/about',
          terms_url: 'https://techcorp.io/terms',
          privacy_url: 'https://techcorp.io/privacy',
          help_url: 'https://techcorp.io/support'
        }),
        custom_css: ':root { --card-border-radius: 12px; }',
        is_active: true,
        created_at: now,
        updated_at: now
      }
    ], {});
  },

  down: async (queryInterface: any, Sequelize: any) => {
    await queryInterface.bulkDelete('white_label_configs', {
      slug: ['default', 'techcorp']
    }, {});
  }
};
