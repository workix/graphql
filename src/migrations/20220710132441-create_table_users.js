'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(transaction => {
      return Promise.all([
        queryInterface.createTable('users', {
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
          email: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: false,
            unique: true
          },
          firebaseMessageToken: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: true
          },
          firebaseUUID: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: false
          }    
        } , { transaction })
      ]);
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(transaction => {
      return Promise.all([
        queryInterface.dropTable('users', { transaction })
      ]);
    })
  }
};
