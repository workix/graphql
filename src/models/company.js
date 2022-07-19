const Sequelize = require('sequelize');
/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  const Company = sequelize.define('Company', {
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
    mobile_phone: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    state: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    neighborhood: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    number: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    street: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    zip_code: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    cnpj: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    logo: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    segment: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id'
      },
      unique: true
    }
  }, {
    tableName: 'companies',
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

  Company.associate = function(models) {
    // associations can be defined here
    Company.hasMany(models.CompanyMedia,{
      foreignKey: 'id',
      as: "medias"      
    })
  };

  return Company;
};
