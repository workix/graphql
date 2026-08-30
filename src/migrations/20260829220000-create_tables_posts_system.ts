'use strict';

module.exports = {
  up: (queryInterface: any, Sequelize: any) => {
    return queryInterface.sequelize.transaction((transaction: any) => {
      return Promise.all([
        queryInterface.createTable('posts', {
          id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
          },
          author_id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false
          },
          content: {
            type: Sequelize.DataTypes.TEXT,
            allowNull: false
          },
          media_ids: {
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

        queryInterface.createTable('post_reactions', {
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
          user_id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false
          },
          type: {
            type: Sequelize.DataTypes.STRING(50),
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

        queryInterface.createTable('post_comments', {
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
          author_id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false
          },
          content: {
            type: Sequelize.DataTypes.TEXT,
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
        queryInterface.dropTable('posts', { transaction }),
        queryInterface.dropTable('post_reactions', { transaction }),
        queryInterface.dropTable('post_comments', { transaction })
      ]);
    });
  }
};
