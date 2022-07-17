const Sequelize = require('sequelize');
/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  const Job = sequelize.define('Job', {
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
    benefits: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    featured: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    job_category: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    job_type: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    max_payment: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    min_payment: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    requirement: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    company_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'Company',
        key: 'id'
      }
    }
  }, {
    tableName: 'jobs',
    hooks: {
      afterCreate(instance, options){
        console.log("HOOK After create")
      },
      beforeUpdate(instance, options){
        instance.updatedAt = Date.now()
      }
    }
  });

  Job.associate = function(models) {
    Job.belongsToMany(models.Candidate,{
      through: 'jobs_candidates',
      foreignKey: 'job_id',
      otherKey: 'candidate_id',
      timestamps: false,
      as: "candidates"      
    });

    Job.belongsTo(models.Company, {
      foreignKey: 'company_id',
    })
  }

  return Job;
};
