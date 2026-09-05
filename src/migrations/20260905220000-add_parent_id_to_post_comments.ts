'use strict';

module.exports = {
  up: (queryInterface: any, Sequelize: any) => {
    return queryInterface.sequelize.transaction(async (transaction: any) => {
      const tableInfo = await queryInterface.describeTable('post_comments');
      if (!tableInfo.parent_id) {
        await queryInterface.addColumn(
          'post_comments',
          'parent_id',
          {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: true
          },
          { transaction }
        );
      }
    });
  },

  down: (queryInterface: any, Sequelize: any) => {
    return queryInterface.sequelize.transaction(async (transaction: any) => {
      const tableInfo = await queryInterface.describeTable('post_comments');
      if (tableInfo.parent_id) {
        await queryInterface.removeColumn('post_comments', 'parent_id', { transaction });
      }
    });
  }
};
