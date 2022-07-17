const Sequelize = require('sequelize');
/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  const SelectiveProcess = sequelize.define('SelectiveProcess', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true 
    },
    activated: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('now'),
    },
    disabled_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    expires_in: {
      type: DataTypes.DATE,
      allowNull: true
    },
    max_candidates: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    starts_in: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('now'),
    },
    uuid: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
    },    
    job_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'Job',
        key: 'id'
      }
    }
  }, {
    tableName: 'selective_processes',
    hooks: {
      afterCreate(instance, options){
        console.log("HOOK After create")
      },
      beforeUpdate(instance, options){
        instance.updatedAt = Date.now()
      }
    }
  });

  SelectiveProcess.associate = function(models) {
    // associations can be defined here
    SelectiveProcess.belongsToMany(models.Candidate,{
      through: 'selective_processes_candidates',
      foreignKey: 'sp_id',
      otherKey: 'candidate_id',
      timestamps: false,
      as: "candidates"      
    });

    SelectiveProcess.belongsTo(models.Job, {
      foreignKey: 'job_id',
    })
  }  

  return SelectiveProcess;
};
