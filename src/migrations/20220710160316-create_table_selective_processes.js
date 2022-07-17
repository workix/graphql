'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(transaction => {
      return Promise.all([
        queryInterface.createTable('selective_processes', {
          id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
          },
          activated: {
            type: Sequelize.DataTypes.BOOLEAN,
            allowNull: false
          },
          created_at: {
            type: Sequelize.DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('now'),
          },
          disabled_at: {
            type: Sequelize.DataTypes.DATE,
            allowNull: true
          },
          expires_in: {
            type: Sequelize.DataTypes.DATE,
            allowNull: true
          },
          max_candidates: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false
          },
          starts_in: {
            type: Sequelize.DataTypes.DATE,
            allowNull: true
          },
          updated_at: {
            type: Sequelize.DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('now'),
          },
          uuid: {
            type: Sequelize.DataTypes.UUID,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4,
          },
          job_id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false,
            references: {
              model: 'jobs',
              key: 'id'
            }
          }
        }, { transaction }),
        queryInterface.createTable('selective_processes_candidates', {
          sp_id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            references: {
              model: 'selective_processes',
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
        queryInterface.dropTable('selective_processes_candidates', { transaction }),
        queryInterface.dropTable('selective_processes', { transaction })
      ]);
    })
  }
};
