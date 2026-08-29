'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(transaction => {
      return Promise.all([
        queryInterface.createTable('resumes', {
          id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
          },
          created_at: {
            type: Sequelize.DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('now'),
          },
          updated_at: {
            type: Sequelize.DataTypes.DATE,
            allowNull: true,
            defaultValue: Sequelize.fn('now'),
          },
          uuid: {
            type: Sequelize.DataTypes.UUID,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4,
          },
          carrer_level: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false
          },
          content: {
            type: Sequelize.DataTypes.TEXT,
            allowNull: false
          },
          objective: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: false
          },
          presence: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false
          },
          candidate_id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false,
            references: {
              model: 'candidates',
              key: 'id'
            },
            unique: true
          }
        }, { transaction }),
        queryInterface.createTable('resumes_educations', {
          id: {
            type: Sequelize.DataTypes.BIGINT,
            primaryKey: false,
            allowNull: false,
            references: {
              model: 'resumes',
              key: 'id'
            }
          },
          description: {
            type: Sequelize.DataTypes.TEXT,
            allowNull: true
          },
          end_date: {
            type: Sequelize.DataTypes.DATEONLY,
            allowNull: true
          },
          qualification: {
            type: Sequelize.DataTypes.TEXT,
            allowNull: true
          },
          school_name: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: true
          },
          start_date: {
            type: Sequelize.DataTypes.DATEONLY,
            allowNull: true
          }
        }, { transaction }),
        queryInterface.createTable('resumes_experiences', {
          id: {
            type: Sequelize.DataTypes.BIGINT,
            primaryKey: false,
            allowNull: false,
            references: {
              model: 'resumes',
              key: 'id'
            }
          },
          description: {
            type: Sequelize.DataTypes.TEXT,
            allowNull: true
          },
          employer_name: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: true
          },
          end_date: {
            type: Sequelize.DataTypes.DATEONLY,
            allowNull: true
          },
          job_title: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: true
          },
          start_date: {
            type: Sequelize.DataTypes.DATEONLY,
            allowNull: false
          },
          responsibilities: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: true
          },
        }, { transaction }),
        queryInterface.createTable('resumes_skills', {
          id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false,
            primaryKey: false,
            references: {
              model: 'resumes',
              key: 'id'
            }
          },
          skill_name: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: false
          },
          months: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: true
          }
        }, { transaction })
      ]);
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(transaction => {
      return Promise.all([
        queryInterface.dropTable('resumes_educations', { transaction }),
        queryInterface.dropTable('resumes_experiences', { transaction }),
        queryInterface.dropTable('resumes_skills', { transaction }),
        queryInterface.dropTable('resumes', { transaction }),
      ]);
    })
  }
};
