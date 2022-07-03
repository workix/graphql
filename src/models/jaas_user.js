const Sequelize = require('sequelize');
const { encodeToBase64 } = require('../utils/Base64EncoderDecoder');
/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  const JAASUser = sequelize.define('JAASUser', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true 
    },
    login: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    tableName: 'JAAS_User',
    timestamps: false,
    hooks: {
      beforeCreate(instance, options){        
        instance.password = encodeToBase64(instance.password)
      },
      beforeUpdate(instance, options){
        
      }
    }
  });

  JAASUser.associate = function(models) {
    // associations can be defined here
    JAASUser.belongsToMany(models.JAASRole, {
      through: 'JAAS_Roles',
      foreignKey: 'id',
      otherKey: 'role_name',
      timestamps: false,
      as: "roles"
    });
  }

  return JAASUser;
};
