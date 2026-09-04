'use strict';

module.exports = {
  up: (queryInterface: any, Sequelize: any) => {
    return queryInterface.sequelize.transaction((transaction: any) => {
      return Promise.all([
        queryInterface.createTable('job_boosts', {
          id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
          },
          job_id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false
          },
          organization_id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false
          },
          source: {
            type: Sequelize.DataTypes.STRING(50),
            allowNull: false,
            defaultValue: 'plan_credit'
          },
          purchase_id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: true
          },
          starts_at: {
            type: Sequelize.DataTypes.DATE,
            allowNull: false
          },
          ends_at: {
            type: Sequelize.DataTypes.DATE,
            allowNull: false
          },
          label: {
            type: Sequelize.DataTypes.STRING(50),
            allowNull: false,
            defaultValue: 'Patrocinada'
          },
          max_concurrent_slot: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 3
          },
          status: {
            type: Sequelize.DataTypes.STRING(30),
            allowNull: false,
            defaultValue: 'active'
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

        queryInterface.createTable('profile_boosts', {
          id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
          },
          candidate_id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false
          },
          subscription_id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: true
          },
          starts_at: {
            type: Sequelize.DataTypes.DATE,
            allowNull: false
          },
          ends_at: {
            type: Sequelize.DataTypes.DATE,
            allowNull: false
          },
          label: {
            type: Sequelize.DataTypes.STRING(50),
            allowNull: false,
            defaultValue: 'Perfil em destaque'
          },
          status: {
            type: Sequelize.DataTypes.STRING(30),
            allowNull: false,
            defaultValue: 'active'
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
        queryInterface.dropTable('profile_boosts', { transaction }),
        queryInterface.dropTable('job_boosts', { transaction })
      ]);
    });
  }
};
