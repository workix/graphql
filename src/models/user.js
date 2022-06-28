/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('User', {
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
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    firebaseMessageToken: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    firebaseUUID: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    tableName: 'users'
  });
};
