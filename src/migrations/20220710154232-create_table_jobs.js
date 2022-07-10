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
          active: {
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
          feature: {
            type: Sequelize.DataTypes.BOOLEAN,
            allowNull: false
          },
          jobCategory: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: false
          },
          jobType: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: false
          },
          maxPayment: {
            type: Sequelize.DataTypes.DECIMAL,
            allowNull: false
          },
          minPayment: {
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
          Job_id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            references: {
              model: 'jobs',
              key: 'id'
            }
          },
          candidates_id: {
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
