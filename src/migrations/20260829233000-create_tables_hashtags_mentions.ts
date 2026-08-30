'use strict';

module.exports = {
  up: (queryInterface: any, Sequelize: any) => {
    return queryInterface.sequelize.transaction((transaction: any) => {
      return Promise.all([
        queryInterface.createTable('hashtags', {
          id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
          },
          tag: {
            type: Sequelize.DataTypes.STRING(100),
            allowNull: false,
            unique: true
          },
          created_at: {
            type: Sequelize.DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('now')
          }
        }, { transaction }),

        queryInterface.createTable('post_hashtags', {
          id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
          },
          post_id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false
          },
          hashtag_id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false
          },
          created_at: {
            type: Sequelize.DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('now')
          }
        }, { transaction }),

        queryInterface.createTable('mentions', {
          id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
          },
          post_id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false
          },
          mentioned_user_id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false
          },
          created_at: {
            type: Sequelize.DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('now')
          }
        }, { transaction })
      ]);
    });
  },

  down: (queryInterface: any, Sequelize: any) => {
    return queryInterface.sequelize.transaction((transaction: any) => {
      return Promise.all([
        queryInterface.dropTable('post_hashtags', { transaction }),
        queryInterface.dropTable('mentions', { transaction }),
        queryInterface.dropTable('hashtags', { transaction })
      ]);
    });
  }
};
