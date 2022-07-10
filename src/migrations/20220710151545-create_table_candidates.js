'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(transaction => {
      return Promise.all([
        queryInterface.createTable('candidates', {
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
          mobilePhone: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: true
          },
          city: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: true
          },
          estate: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: true
          },
          neighborhood: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: true
          },
          number: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: true
          },
          street: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: true
          },
          zipCode: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: true
          },
          name: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: false
          },
          birthDate: {
            type: Sequelize.DataTypes.DATEONLY,
            allowNull: false
          },
          cpf: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false,
            unique: true
          },
          user_id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false,
            references: {
              model: 'users',
              key: 'id'
            },
            unique: true
          }
        }, { transaction })
      ]);
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(transaction => {
      return Promise.all([
        queryInterface.dropTable('candidates', { transaction })
      ]);
    })
  }
};
