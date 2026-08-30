'use strict';

module.exports = {
  up: (queryInterface: any, Sequelize: any) => {
    return queryInterface.sequelize.transaction(async (transaction: any) => {
      await queryInterface.addColumn('users', 'verified', {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }, { transaction });

      await queryInterface.addColumn('users', 'verification_method', {
        type: Sequelize.DataTypes.ENUM('GOV_ID', 'WORK_EMAIL', 'PHONE'),
        allowNull: true
      }, { transaction });
    });
  },

  down: (queryInterface: any) => {
    return queryInterface.sequelize.transaction(async (transaction: any) => {
      await queryInterface.removeColumn('users', 'verification_method', { transaction });
      await queryInterface.removeColumn('users', 'verified', { transaction });
    });
  }
};
