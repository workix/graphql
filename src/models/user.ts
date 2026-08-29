const Sequelize = require('sequelize');
/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('User', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true 
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('now'),
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.fn('now'),
    },
    uuid: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
    },    
    activated: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    firebase_message_token: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    firebase_uuid: {
      type: DataTypes.STRING(255),
      allowNull: false
    }    
  }  
  , {
    tableName: 'users',    
    hooks: {
      afterCreate(instance, options){
        console.log("HOOK After create")
      },
      beforeUpdate(instance, options){
        instance.updated_at = Date.now()
      }
    }
  } );
};

export {};
