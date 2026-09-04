'use strict';

module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    await queryInterface.addColumn('jobs', 'is_pcd', {
      type: Sequelize.DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });

    await queryInterface.addColumn('jobs', 'is_remote', {
      type: Sequelize.DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });

    await queryInterface.addColumn('jobs', 'pcd_details', {
      type: Sequelize.DataTypes.TEXT,
      allowNull: true
    });

    await queryInterface.addColumn('jobs', 'accessibility_features', {
      type: Sequelize.DataTypes.TEXT,
      allowNull: true,
      defaultValue: '[]'
    });
  },

  down: async (queryInterface: any, Sequelize: any) => {
    await queryInterface.removeColumn('jobs', 'accessibility_features');
    await queryInterface.removeColumn('jobs', 'pcd_details');
    await queryInterface.removeColumn('jobs', 'is_remote');
    await queryInterface.removeColumn('jobs', 'is_pcd');
  }
};
