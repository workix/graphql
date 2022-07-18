const Sequelize = require('sequelize');
/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  const Resume = sequelize.define('Resume', {
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
    carrer_level: {
      type: DataTypes.STRING,
      allowNull: false
    },    
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    objective: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    presence: {
      type: DataTypes.STRING,
      allowNull: false
    },  
    candidate_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'Candidate',
        key: 'id'
      },
      unique: true
    }
  }, {
    tableName: 'resumes',
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

  Resume.associate = function(models) {
    // associations can be defined here
    Resume.hasMany(models.ResumeEducation,{
      foreignKey: 'id',
      as: "educations"      
    });

    Resume.hasMany(models.ResumeExperience,{
      foreignKey: 'id',
      as: "experiences"      
    });

    Resume.hasMany(models.ResumeSkill,{
      foreignKey: 'id',
      as: "skills"      
    });

    Resume.belongsTo(models.Candidate, {
      foreignKey: 'candidate_id',
    })
  }

  return Resume;
};
