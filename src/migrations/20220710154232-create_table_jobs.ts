'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(transaction => {
      return Promise.all([
        queryInterface.createTable('jobs', {
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
          activated: {
            type: Sequelize.DataTypes.BOOLEAN,
            allowNull: false
          },
          benefits: {
            type: Sequelize.DataTypes.TEXT,
            allowNull: false
          },
          description: {
            type: Sequelize.DataTypes.TEXT,
            allowNull: false
          },
          featured: {
            type: Sequelize.DataTypes.BOOLEAN,
            allowNull: false
          },
          job_category: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: false
          },
          job_type: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: false
          },
          max_payment: {
            type: Sequelize.DataTypes.DECIMAL,
            allowNull: false
          },
          min_payment: {
            type: Sequelize.DataTypes.DECIMAL,
            allowNull: false
          },
          requirement: {
            type: Sequelize.DataTypes.TEXT,
            allowNull: false
          },
          title: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: false
          },
          company_id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false,
            references: {
              model: 'companies',
              key: 'id'
            }
          }
        }, { transaction }),
        queryInterface.createTable('jobs_candidates', {
          job_id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            references: {
              model: 'jobs',
              key: 'id'
            }
          },
          candidate_id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            references: {
              model: 'candidates',
              key: 'id'
            }
          }
        }, { transaction })
      ]);
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(transaction => {
      return Promise.all([
        queryInterface.dropTable('jobs_candidates', { transaction }),
        queryInterface.dropTable('jobs', { transaction })
      ]);
    })
  }
};
