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
          active: {
            type: Sequelize.DataTypes.BOOLEAN,
            allowNull: false
          },
          createdAt: {
            type: Sequelize.DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('now'),
          },
          disabledAt: {
            type: Sequelize.DataTypes.DATE,
            allowNull: true
          },
          expire: {
            type: Sequelize.DataTypes.DATE,
            allowNull: true
          },
          maxCandidates: {
            type: Sequelize.DataTypes.INTEGER(11),
            allowNull: false
          },
          start: {
            type: Sequelize.DataTypes.DATE,
            allowNull: true
          },
          updatedAt: {
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
