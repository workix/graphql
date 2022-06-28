/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Member', {
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
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    occupation: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    picture: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    shortText: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    tableName: 'members'
  });
};
