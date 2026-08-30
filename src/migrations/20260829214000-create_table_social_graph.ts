'use strict';

module.exports = {
  up: (queryInterface: any, Sequelize: any) => {
    return queryInterface.sequelize.transaction((transaction: any) => {
      return Promise.all([
        queryInterface.createTable('connection_requests', {
          id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
          },
          requester_id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false
          },
          recipient_id: {
            type: Sequelize.DataTypes.BIGINT,
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
        }, { transaction }),

        queryInterface.createTable('connections', {
          id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
          },
          user_id_1: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false
          },
          user_id_2: {
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

        queryInterface.createTable('follows', {
          id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
          },
          follower_id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false
          },
          following_id: {
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
        queryInterface.dropTable('connection_requests', { transaction }),
        queryInterface.dropTable('connections', { transaction }),
        queryInterface.dropTable('follows', { transaction })
      ]);
    });
  }
};
