'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(transaction => {
      return Promise.all([
        queryInterface.createTable('authors', {
          id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
          },
          createdAt: {
            type: Sequelize.DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('now'),
          },
          updatedAt: {
            type: Sequelize.DataTypes.DATE,
            allowNull: true,
            defaultValue: Sequelize.fn('now'),
          },
          uuid: {
            type: Sequelize.DataTypes.UUID,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4,
          },
          aboutText: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: false
          },
          name: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: false
          },
          picture: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: true
          }
        }, { transaction }),
        queryInterface.createTable('authors_medias', {
          id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            references: {
              model: 'authors',
              key: 'id'
            }
          },
          media: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: false
          },
          url: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: false
          }
        }, { transaction })
      ]);
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(transaction => {
      return Promise.all([
        queryInterface.dropTable('authors_medias', { transaction }),
        queryInterface.dropTable('authors', { transaction })
      ]);
    })
  }
};
