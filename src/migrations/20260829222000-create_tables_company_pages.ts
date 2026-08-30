'use strict';

module.exports = {
  up: (queryInterface: any, Sequelize: any) => {
    return queryInterface.sequelize.transaction((transaction: any) => {
      return Promise.all([
        queryInterface.createTable('company_pages', {
          id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
          },
          name: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: false
          },
          industry: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: true
          },
          size: {
            type: Sequelize.DataTypes.STRING(100),
            allowNull: true
          },
          logo_url: {
            type: Sequelize.DataTypes.STRING(512),
            allowNull: true
          },
          banner_url: {
            type: Sequelize.DataTypes.STRING(512),
            allowNull: true
          },
          description: {
            type: Sequelize.DataTypes.TEXT,
            allowNull: true
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
        }, { transaction }),

        queryInterface.createTable('company_admins', {
          id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
          },
          company_id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false
          },
          user_id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false
          },
          role: {
            type: Sequelize.DataTypes.STRING(50),
            allowNull: false,
            defaultValue: 'ADMIN'
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
        }, { transaction }),

        queryInterface.createTable('company_followers', {
          id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
          },
          company_id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false
          },
          user_id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false
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
        queryInterface.dropTable('company_pages', { transaction }),
        queryInterface.dropTable('company_admins', { transaction }),
        queryInterface.dropTable('company_followers', { transaction })
      ]);
    });
  }
};
