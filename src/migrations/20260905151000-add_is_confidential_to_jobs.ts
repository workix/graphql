module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    await queryInterface.addColumn('jobs', 'is_confidential', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });
  },

  down: async (queryInterface: any) => {
    await queryInterface.removeColumn('jobs', 'is_confidential');
  }
};
