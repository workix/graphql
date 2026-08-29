'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(transaction => {
      return Promise.all([
        queryInterface.createTable('blogs', {
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
          citation: {
            type: Sequelize.DataTypes.TEXT,
            allowNull: true
          },
          content: {
            type: Sequelize.DataTypes.TEXT,
            allowNull: true
          },
          date: {
            type: Sequelize.DataTypes.DATEONLY,
            allowNull: true
          },
          resume: {
            type: Sequelize.DataTypes.TEXT,
            allowNull: true
          },
          title: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: true
          },
          author_id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false,
            references: {
              model: 'authors',
              key: 'id'
            }
          }
        }, { transaction }),
        queryInterface.createTable('blogs_categories', {
          id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false,
            primaryKey: false,
            references: {
              model: 'blogs',
              key: 'id'
            }
          },
          category: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: false
          }
        }, { transaction }),
        queryInterface.createTable('blogs_comments', {
          blog_id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            references: {
              model: 'blogs',
              key: 'id'
            }
          },
          comment_id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            references: {
              model: 'comments',
              key: 'id'
            }
          },
        }, { transaction }),
        queryInterface.createTable('blogs_pictures', {
          id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false,
            primaryKey: false,
            references: {
              model: 'blogs',
              key: 'id'
            }
          },
          picture: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: false
          }
        }, { transaction }),
        queryInterface.createTable('blogs_tags', {
          id: {
            type: Sequelize.DataTypes.BIGINT,
            primaryKey: false,
            allowNull: false,
            references: {
              model: 'blogs',
              key: 'id'
            }
          },
          name: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: true
          }
        }, { transaction }),
      ]);
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(transaction => {
      return Promise.all([
        queryInterface.dropTable('blogs_categories', { transaction }),
        queryInterface.dropTable('blogs_comments', { transaction }),
        queryInterface.dropTable('blogs_pictures', { transaction }),
        queryInterface.dropTable('blogs_tags', { transaction }),
        queryInterface.dropTable('blogs', { transaction })
      ]);
    })
  }
};
