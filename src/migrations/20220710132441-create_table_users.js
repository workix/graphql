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
          email: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: false,
            unique: true
          },
          firebase_message_token: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: true
          },
          firebase_uuid: {
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
