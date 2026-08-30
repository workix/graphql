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
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    tableName: 'jaas_user',
    timestamps: false,    
    hooks: {
      beforeCreate(instance, options){        
        instance.password = encodeToBase64(instance.password)
      },
      beforeBulkUpdate(instance, options){        
        instance.attributes.password = encodeToBase64(instance.attributes.password)
      }
    }
  });

  JAASUser.associate = function(models) {
    // associations can be defined here
    JAASUser.belongsToMany(models.JAASRole, {
      through: models.JAASRoles,
      foreignKey: 'id',
      otherKey: 'role_name',
      timestamps: false,
      as: "roles"
    });
  }

  return JAASUser;
};

export {};
