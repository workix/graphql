'use strict';

module.exports = {
  up: (queryInterface: any, Sequelize: any) => {
    return queryInterface.sequelize.transaction((transaction: any) => {
      return Promise.all([
        queryInterface.createTable('groups', {
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
          description: {
            type: Sequelize.DataTypes.TEXT,
            allowNull: true
          },
          privacy: {
            type: Sequelize.DataTypes.STRING(50),
            allowNull: false,
            defaultValue: 'PUBLIC'
          },
          owner_id: {
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

        queryInterface.createTable('group_memberships', {
          id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
          },
          group_id: {
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
            defaultValue: 'MEMBER'
          },
          status: {
            type: Sequelize.DataTypes.STRING(50),
            allowNull: false,
            defaultValue: 'APPROVED'
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

        queryInterface.createTable('group_posts', {
          id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
          },
          group_id: {
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
        queryInterface.dropTable('groups', { transaction }),
        queryInterface.dropTable('group_memberships', { transaction }),
        queryInterface.dropTable('group_posts', { transaction })
      ]);
    });
  }
};
