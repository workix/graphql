'use strict';

module.exports = {
  up: (queryInterface: any, Sequelize: any) => {
    return queryInterface.sequelize.transaction((transaction: any) => {
      return Promise.all([
        queryInterface.createTable('events', {
          id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
          },
          title: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: false
          },
          description: {
            type: Sequelize.DataTypes.TEXT,
            allowNull: true
          },
          event_type: {
            type: Sequelize.DataTypes.STRING(50),
            allowNull: false,
            defaultValue: 'ONLINE'
          },
          start_time: {
            type: Sequelize.DataTypes.DATE,
            allowNull: false
          },
          end_time: {
            type: Sequelize.DataTypes.DATE,
            allowNull: true
          },
          location_or_url: {
            type: Sequelize.DataTypes.STRING(500),
            allowNull: true
          },
          organizer_id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false
          },
          created_at: {
            type: Sequelize.DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('now')
          },
          updated_at: {
            type: Sequelize.DataTypes.DATE,
            allowNull: true,
            defaultValue: Sequelize.fn('now')
          }
        }, { transaction }),

        queryInterface.createTable('event_attendees', {
          id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
          },
          event_id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false
          },
          user_id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false
          },
          status: {
            type: Sequelize.DataTypes.STRING(50),
            allowNull: false,
            defaultValue: 'ATTENDING'
          },
          created_at: {
            type: Sequelize.DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('now')
          },
          updated_at: {
            type: Sequelize.DataTypes.DATE,
            allowNull: true,
            defaultValue: Sequelize.fn('now')
          }
        }, { transaction })
      ]);
    });
  },

  down: (queryInterface: any, Sequelize: any) => {
    return queryInterface.sequelize.transaction((transaction: any) => {
      return Promise.all([
        queryInterface.dropTable('events', { transaction }),
        queryInterface.dropTable('event_attendees', { transaction })
      ]);
    });
  }
};
