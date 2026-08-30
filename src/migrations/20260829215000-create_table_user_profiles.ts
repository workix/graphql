'use strict';

module.exports = {
  up: (queryInterface: any, Sequelize: any) => {
    return queryInterface.sequelize.transaction((transaction: any) => {
      return Promise.all([
        queryInterface.createTable('user_profiles', {
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
          headline: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: true
          },
          about: {
            type: Sequelize.DataTypes.TEXT,
            allowNull: true
          },
          banner_url: {
            type: Sequelize.DataTypes.STRING(512),
            allowNull: true
          },
          location: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: true
          },
          industry: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: true
          },
          open_to_work: {
            type: Sequelize.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
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
        queryInterface.dropTable('user_profiles', { transaction })
      ]);
    });
  }
};
