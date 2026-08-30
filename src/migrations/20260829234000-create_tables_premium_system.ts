'use strict';

module.exports = {
  up: (queryInterface: any, Sequelize: any) => {
    return queryInterface.sequelize.transaction((transaction: any) => {
      return Promise.all([
        queryInterface.createTable('subscription_plans', {
          id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
          },
          name: {
            type: Sequelize.DataTypes.STRING(100),
            allowNull: false
          },
          price: {
            type: Sequelize.DataTypes.DECIMAL(10, 2),
            allowNull: false
          },
          billing_period: {
            type: Sequelize.DataTypes.STRING(20),
            allowNull: false,
            defaultValue: 'MONTHLY'
          },
          inmail_credits_per_month: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
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

        queryInterface.createTable('user_subscriptions', {
          id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
          },
          user_id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false
          },
          plan_id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false
          },
          status: {
            type: Sequelize.DataTypes.STRING(20),
            allowNull: false,
            defaultValue: 'ACTIVE'
          },
          inmail_credits_remaining: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
          },
          started_at: {
            type: Sequelize.DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('now')
          },
          expires_at: {
            type: Sequelize.DataTypes.DATE,
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
        queryInterface.dropTable('user_subscriptions', { transaction }),
        queryInterface.dropTable('subscription_plans', { transaction })
      ]);
    });
  }
};
