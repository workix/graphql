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
    expires_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    outcome_status: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'OPEN'
    },
    is_sponsored: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    sponsor_label: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'Patrocinada'
    },
    skills: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: '[]'
    },
    workplace_type: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'ON_SITE'
    },
    seniority_level: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'PLENO'
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    state: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    search_vector: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    is_pcd: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    is_remote: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    pcd_details: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    accessibility_features: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: '[]'
    },
    categories: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: '[]'
    },
    employment_type: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'CLT'
    },
    company_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'companies',
        key: 'id'
      }
    }
  }, {
    tableName: 'jobs',
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

export {};
