'use strict';

module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    await queryInterface.addColumn('jobs', 'skills', {
      type: Sequelize.DataTypes.TEXT,
      allowNull: true,
      defaultValue: '[]'
    });

    await queryInterface.addColumn('jobs', 'workplace_type', {
      type: Sequelize.DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'ON_SITE'
    });

    await queryInterface.addColumn('jobs', 'seniority_level', {
      type: Sequelize.DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'PLENO'
    });

    await queryInterface.addColumn('jobs', 'city', {
      type: Sequelize.DataTypes.STRING(100),
      allowNull: true
    });

    await queryInterface.addColumn('jobs', 'state', {
      type: Sequelize.DataTypes.STRING(10),
      allowNull: true
    });

    await queryInterface.addColumn('jobs', 'search_vector', {
      type: Sequelize.DataTypes.TEXT,
      allowNull: true
    });
  },

  down: async (queryInterface: any, Sequelize: any) => {
    await queryInterface.removeColumn('jobs', 'search_vector');
    await queryInterface.removeColumn('jobs', 'state');
    await queryInterface.removeColumn('jobs', 'city');
    await queryInterface.removeColumn('jobs', 'seniority_level');
    await queryInterface.removeColumn('jobs', 'workplace_type');
    await queryInterface.removeColumn('jobs', 'skills');
  }
};
