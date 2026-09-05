'use strict';

module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    await queryInterface.addColumn('jobs', 'categories', {
      type: Sequelize.DataTypes.TEXT,
      allowNull: true,
      defaultValue: '[]'
    });

    await queryInterface.addColumn('jobs', 'employment_type', {
      type: Sequelize.DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'CLT'
    });
  },

  down: async (queryInterface: any, Sequelize: any) => {
    await queryInterface.removeColumn('jobs', 'employment_type');
    await queryInterface.removeColumn('jobs', 'categories');
  }
};
