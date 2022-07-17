const Sequelize = require('sequelize');
/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  const Member = sequelize.define('Member', {
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
      allowNull: false
    },
    short_text: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    tableName: 'members',
    hooks: {
      afterCreate(instance, options){
        console.log("HOOK After create")
      },
      beforeUpdate(instance, options){
        instance.updatedAt = Date.now()
      }
    }
  });


  Member.associate = function(models) {
    // associations can be defined here
    Member.hasMany(models.MemberMedia,{
      foreignKey: 'id',
      as: "medias"      
    })
  };

  return Member;
};
