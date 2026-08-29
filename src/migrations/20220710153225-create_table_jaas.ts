'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(transaction => {
      return Promise.all([
        queryInterface.createTable('jaas_user', {
          id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
          },
          login: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: false,
            unique: true
          },
          password: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: false
          }
        }, { transaction }),
        queryInterface.createTable('jaas_role', {
          name: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: false,
            primaryKey: true
          }
        }, { transaction }),
        queryInterface.createTable('jaas_roles', {
          id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            references: {
              model: 'jaas_user',
              key: 'id'
            }
          },
          role_name: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: false,
            primaryKey: true,
            references: {
              model: 'jaas_role',
              key: 'name'
            }
          }
        }, { transaction })
      ]);
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(transaction => {
      return Promise.all([
        queryInterface.dropTable('jaas_roles', { transaction }),
        queryInterface.dropTable('jaas_role', { transaction }),
        queryInterface.dropTable('jaas_user', { transaction })
      ]);
    })
  }
};
