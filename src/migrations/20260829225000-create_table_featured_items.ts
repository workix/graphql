'use strict';

module.exports = {
  up: (queryInterface: any, Sequelize: any) => {
    return queryInterface.sequelize.transaction((transaction: any) => {
      return Promise.all([
        queryInterface.createTable('featured_items', {
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
          url: {
            type: Sequelize.DataTypes.STRING(512),
            allowNull: true
          },
          media_id: {
            type: Sequelize.DataTypes.BIGINT,
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
        queryInterface.dropTable('featured_items', { transaction })
      ]);
    });
  }
};
