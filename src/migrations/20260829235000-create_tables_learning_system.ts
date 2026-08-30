'use strict';

module.exports = {
  up: (queryInterface: any, Sequelize: any) => {
    return queryInterface.sequelize.transaction((transaction: any) => {
      return Promise.all([
        queryInterface.createTable('courses', {
          id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
          },
          title: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: false
          },
          description: {
            type: Sequelize.DataTypes.TEXT,
            allowNull: true
          },
          instructor_id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false
          },
          media_id: {
            type: Sequelize.DataTypes.BIGINT,
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

        queryInterface.createTable('course_lessons', {
          id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
          },
          course_id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false
          },
          title: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: false
          },
          media_id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: true
          },
          order_index: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
          },
          created_at: {
            type: Sequelize.DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('now')
          }
        }, { transaction }),

        queryInterface.createTable('course_enrollments', {
          id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
          },
          course_id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false
          },
          user_id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false
          },
          enrolled_at: {
            type: Sequelize.DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('now')
          }
        }, { transaction }),

        queryInterface.createTable('course_completions', {
          id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
          },
          enrollment_id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false
          },
          completed_at: {
            type: Sequelize.DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('now')
          },
          certificate_url: {
            type: Sequelize.DataTypes.STRING(512),
            allowNull: true
          }
        }, { transaction })
      ]);
    });
  },

  down: (queryInterface: any, Sequelize: any) => {
    return queryInterface.sequelize.transaction((transaction: any) => {
      return Promise.all([
        queryInterface.dropTable('course_completions', { transaction }),
        queryInterface.dropTable('course_enrollments', { transaction }),
        queryInterface.dropTable('course_lessons', { transaction }),
        queryInterface.dropTable('courses', { transaction })
      ]);
    });
  }
};
