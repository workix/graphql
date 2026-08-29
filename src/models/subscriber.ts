const Sequelize = require('sequelize');
/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Subscriber', {
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
    email: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    tableName: 'subscribers',
    hooks: {
      afterCreate(instance, options){
        console.log("HOOK After create")
      },
      beforeBulkUpdate(instance, options){
        console.log("HOOK beforeUpdate")
        instance.attributes.updated_at = Date.now()
      }
    }
  });
};

export {};
