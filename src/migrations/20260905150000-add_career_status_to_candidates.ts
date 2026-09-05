module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    await queryInterface.addColumn('candidates', 'looking_for_job', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });

    await queryInterface.addColumn('candidates', 'in_career_transition', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });

    await queryInterface.addColumn('candidates', 'career_transition_target', {
      type: Sequelize.STRING(150),
      allowNull: true
    });

    await queryInterface.addColumn('candidates', 'accepts_entry_level', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });
  },

  down: async (queryInterface: any) => {
    await queryInterface.removeColumn('candidates', 'looking_for_job');
    await queryInterface.removeColumn('candidates', 'in_career_transition');
    await queryInterface.removeColumn('candidates', 'career_transition_target');
    await queryInterface.removeColumn('candidates', 'accepts_entry_level');
  }
};
