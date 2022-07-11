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
          createdAt: {
            type: Sequelize.DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('now'),
          },
          updatedAt: {
            type: Sequelize.DataTypes.DATE,
            allowNull: true,
            defaultValue: Sequelize.fn('now'),
          },
          uuid: {
            type: Sequelize.DataTypes.UUID,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4,
          },
          carrerLevel: {
            type: Sequelize.DataTypes.INTEGER,
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
            type: Sequelize.DataTypes.INTEGER,
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
          endDate: {
            type: Sequelize.DataTypes.DATEONLY,
            allowNull: true
          },
          qualification: {
            type: Sequelize.DataTypes.TEXT,
            allowNull: true
          },
          schoolName: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: true
          },
          startDate: {
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
          employerName: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: true
          },
          endDate: {
            type: Sequelize.DataTypes.DATEONLY,
            allowNull: true
          },
          jobTitle: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: true
          },
          startDate: {
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
          skillName: {
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
