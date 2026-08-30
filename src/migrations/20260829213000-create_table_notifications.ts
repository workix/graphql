'use strict';

module.exports = {
  up: (queryInterface: any, Sequelize: any) => {
    return queryInterface.sequelize.transaction((transaction: any) => {
      return Promise.all([
        queryInterface.createTable('notifications', {
          id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
          },
          user_id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false
          },
          type: {
            type: Sequelize.DataTypes.STRING(50),
            allowNull: false
          },
          title: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: false
          },
          body: {
            type: Sequelize.DataTypes.TEXT,
            allowNull: false
          },
          read: {
            type: Sequelize.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
          },
          data: {
            type: Sequelize.DataTypes.TEXT,
            allowNull: true
          },
          created_at: {
            type: Sequelize.DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('now')
          },
          updated_at: {
            type: Sequelize.DataTypes.DATE,
            allowNull: true,
            defaultValue: Sequelize.fn('now')
          }
        }, { transaction })
      ]);
    });
  },

  down: (queryInterface: any, Sequelize: any) => {
    return queryInterface.sequelize.transaction((transaction: any) => {
      return Promise.all([
        queryInterface.dropTable('notifications', { transaction })
      ]);
    });
  }
};
