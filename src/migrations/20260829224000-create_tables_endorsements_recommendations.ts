'use strict';

module.exports = {
  up: (queryInterface: any, Sequelize: any) => {
    return queryInterface.sequelize.transaction((transaction: any) => {
      return Promise.all([
        queryInterface.createTable('skill_endorsements', {
          id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
          },
          skill_id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false
          },
          endorser_id: {
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
        }, { transaction }),

        queryInterface.createTable('recommendations', {
          id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
          },
          recommender_id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false
          },
          recipient_id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false
          },
          content: {
            type: Sequelize.DataTypes.TEXT,
            allowNull: false
          },
          status: {
            type: Sequelize.DataTypes.STRING(50),
            allowNull: false,
            defaultValue: 'PENDING'
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
        queryInterface.dropTable('skill_endorsements', { transaction }),
        queryInterface.dropTable('recommendations', { transaction })
      ]);
    });
  }
};
