'use strict';

module.exports = {
  up: (queryInterface: any, Sequelize: any) => {
    return queryInterface.sequelize.transaction((transaction: any) => {
      return Promise.all([
        queryInterface.createTable('white_label_configs', {
          id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
          },
          slug: {
            type: Sequelize.DataTypes.STRING(100),
            allowNull: false,
            unique: true
          },
          name: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: false
          },
          custom_domain: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: true,
            unique: true
          },
          logo_url: {
            type: Sequelize.DataTypes.STRING(1024),
            allowNull: true
          },
          logo_dark_url: {
            type: Sequelize.DataTypes.STRING(1024),
            allowNull: true
          },
          favicon_url: {
            type: Sequelize.DataTypes.STRING(1024),
            allowNull: true
          },
          primary_color: {
            type: Sequelize.DataTypes.STRING(32),
            allowNull: false,
            defaultValue: '#0A66C2'
          },
          secondary_color: {
            type: Sequelize.DataTypes.STRING(32),
            allowNull: false,
            defaultValue: '#004182'
          },
          accent_color: {
            type: Sequelize.DataTypes.STRING(32),
            allowNull: false,
            defaultValue: '#70B5F9'
          },
          background_color: {
            type: Sequelize.DataTypes.STRING(32),
            allowNull: false,
            defaultValue: '#F3F2EF'
          },
          text_color: {
            type: Sequelize.DataTypes.STRING(32),
            allowNull: false,
            defaultValue: '#191919'
          },
          font_family: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: false,
            defaultValue: 'Inter, -apple-system, system-ui, sans-serif'
          },
          app_title: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: false,
            defaultValue: 'Workix - Portal de Vagas e Carreiras'
          },
          meta_description: {
            type: Sequelize.DataTypes.TEXT,
            allowNull: true
          },
          institutional_links: {
            type: Sequelize.DataTypes.TEXT,
            allowNull: true
          },
          custom_css: {
            type: Sequelize.DataTypes.TEXT,
            allowNull: true
          },
          is_active: {
            type: Sequelize.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
          },
          created_at: {
            type: Sequelize.DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('now')
          },
          updated_at: {
            type: Sequelize.DataTypes.DATE,
            allowNull: true,
            defaultValue: Sequelize.fn('now')
          }
        }, { transaction })
      ]);
    });
  },

  down: (queryInterface: any, Sequelize: any) => {
    return queryInterface.sequelize.transaction((transaction: any) => {
      return Promise.all([
        queryInterface.dropTable('white_label_configs', { transaction })
      ]);
    });
  }
};
