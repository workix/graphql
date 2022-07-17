'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(transaction => {
      return Promise.all([
        queryInterface.createTable('comments', {
          id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
          },
          created_at: {
            type: Sequelize.DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('now'),
          },
          updated_at: {
            type: Sequelize.DataTypes.DATE,
            allowNull: true,
            defaultValue: Sequelize.fn('now'),
          },
          uuid: {
            type: Sequelize.DataTypes.UUID,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4,
          },
          email: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: false
          },
          name: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: false
          },
          text: {
            type: Sequelize.DataTypes.TEXT,
            allowNull: false
          },
          parent_id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: true,
            primaryKey: false,
            references: {
              model: 'comments',
              key: 'id'
            }
          }
        }, { transaction })
      ]);
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(transaction => {
      return Promise.all([
        queryInterface.dropTable('comments', { transaction })
      ]);
    })
  }
};
