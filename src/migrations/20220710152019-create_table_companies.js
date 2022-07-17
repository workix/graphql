'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(transaction => {
      return Promise.all([
        queryInterface.createTable('companies', {
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
          mobile_phone: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false
          },
          city: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: false
          },
          state: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: false
          },
          neighborhood: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: false
          },
          number: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: false
          },
          street: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: false
          },
          zip_code: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false
          },
          name: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: false
          },
          cnpj: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false,
            unique: false
          },
          description: {
            type: Sequelize.DataTypes.TEXT,
            allowNull: true
          },
          logo: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: false
          },
          segment: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: false
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
        }, { transaction }),
        queryInterface.createTable('companies_medias', {
          id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false,
            primaryKey: false,
            references: {
              model: 'companies',
              key: 'id'
            }
          },
          media: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: true
          },
          url: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: true
          }
        }, { transaction })
      ]);
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(transaction => {
      return Promise.all([
        queryInterface.dropTable('companies_medias', { transaction }),
        queryInterface.dropTable('companies', { transaction })
      ]);
    })
  }
};
