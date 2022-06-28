/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Form', {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: true
      },
      uuid: {
        type: DataTypes.STRING(255),
        allowNull: false
      },    
      email: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      message: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      subject: {
        type: DataTypes.STRING(255),
        allowNull: true
      }
    }, {
      tableName: 'forms'
    });
  };
  