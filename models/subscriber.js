/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('subscriber', {
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
    version: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    tableName: 'subscriber'
  });
};
