/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('BlogCategory', {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'blogs',
          key: 'id'
        }
      },
      category: {
        type: DataTypes.STRING(255),
        allowNull: false
      }
    }, {
      tableName: 'blogs_categories',
      timestamps: false
    });
  };
  
export {};
