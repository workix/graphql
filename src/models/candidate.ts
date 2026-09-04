const Sequelize = require('sequelize');
/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Candidate', {
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
    mobile_phone: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    city: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    state: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    neighborhood: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    number: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    street: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    zip_code: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    birth_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    cpf: {
      type: DataTypes.BIGINT,
      allowNull: true,
      unique: true
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      unique: true
    }
  }, {
    tableName: 'candidates',
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
