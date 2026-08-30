'use strict';

module.exports = {
  up: (queryInterface: any, Sequelize: any) => {
    return queryInterface.sequelize.transaction((transaction: any) => {
      return Promise.all([
        queryInterface.createTable('job_postings', {
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
          title: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: false
          },
          description: {
            type: Sequelize.DataTypes.TEXT,
            allowNull: false
          },
          location: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: true
          },
          work_type: {
            type: Sequelize.DataTypes.STRING(50),
            allowNull: true
          },
          required_skills: {
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

        queryInterface.createTable('job_applications', {
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
          candidate_id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false
          },
          resume_id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: true
          },
          status: {
            type: Sequelize.DataTypes.STRING(50),
            allowNull: false,
            defaultValue: 'SUBMITTED'
          },
          match_score: {
            type: Sequelize.DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0.0
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
        queryInterface.dropTable('job_postings', { transaction }),
        queryInterface.dropTable('job_applications', { transaction })
      ]);
    });
  }
};
