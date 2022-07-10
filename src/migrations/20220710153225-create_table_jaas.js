'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(transaction => {
      return Promise.all([
        queryInterface.createTable('JAAS_User', {
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
        queryInterface.createTable('JAAS_Role', {
          name: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: false,
            primaryKey: true
          }
        }, { transaction }),
        queryInterface.createTable('JAAS_Roles', {
          id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            references: {
              model: 'JAAS_User',
              key: 'id'
            }
          },
          role_name: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: false,
            primaryKey: true,
            references: {
              model: 'JAAS_Role',
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
        queryInterface.dropTable('JAAS_Roles', { transaction }),
        queryInterface.dropTable('JAAS_Role', { transaction }),
        queryInterface.dropTable('JAAS_User', { transaction })
      ]);
    })
  }
};
