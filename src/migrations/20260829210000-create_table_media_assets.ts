'use strict';

module.exports = {
  up: (queryInterface: any, Sequelize: any) => {
    return queryInterface.sequelize.transaction((transaction: any) => {
      return Promise.all([
        queryInterface.createTable('media_assets', {
          id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
          },
          file_name: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: false
          },
          file_type: {
            type: Sequelize.DataTypes.STRING(100),
            allowNull: false
          },
          context: {
            type: Sequelize.DataTypes.STRING(100),
            allowNull: false
          },
          url: {
            type: Sequelize.DataTypes.STRING(512),
            allowNull: true
          },
          status: {
            type: Sequelize.DataTypes.STRING(50),
            allowNull: false,
            defaultValue: 'PENDING'
          },
          user_id: {
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
        queryInterface.dropTable('media_assets', { transaction })
      ]);
    });
  }
};
