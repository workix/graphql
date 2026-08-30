const Sequelize = require('sequelize');
/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Form', {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true 
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: Sequelize.NOW,
      },
      uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
      },    
      email: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      message: {
        type: DataTypes.TEXT,
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
      tableName: 'forms',
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
