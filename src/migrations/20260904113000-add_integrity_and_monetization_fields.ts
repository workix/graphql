'use strict';

module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    // Add columns to companies
    await queryInterface.addColumn('companies', 'response_rate_90d', {
      type: Sequelize.DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 100.00
    });

    await queryInterface.addColumn('companies', 'median_response_time_days', {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 7
    });

    await queryInterface.addColumn('companies', 'verified_at', {
      type: Sequelize.DataTypes.DATE,
      allowNull: true
    });

    // Add columns to jobs
    await queryInterface.addColumn('jobs', 'expires_at', {
      type: Sequelize.DataTypes.DATE,
      allowNull: true
    });

    await queryInterface.addColumn('jobs', 'outcome_status', {
      type: Sequelize.DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'OPEN'
    });

    await queryInterface.addColumn('jobs', 'is_sponsored', {
      type: Sequelize.DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });

    await queryInterface.addColumn('jobs', 'sponsor_label', {
      type: Sequelize.DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'Patrocinada'
    });
  },

  down: async (queryInterface: any, Sequelize: any) => {
    await queryInterface.removeColumn('jobs', 'sponsor_label');
    await queryInterface.removeColumn('jobs', 'is_sponsored');
    await queryInterface.removeColumn('jobs', 'outcome_status');
    await queryInterface.removeColumn('jobs', 'expires_at');
    await queryInterface.removeColumn('companies', 'verified_at');
    await queryInterface.removeColumn('companies', 'median_response_time_days');
    await queryInterface.removeColumn('companies', 'response_rate_90d');
  }
};
