const Sequelize = require('sequelize');
/* jshint indent: 2 */

module.exports = function(sequelize: any, DataTypes: any) {
  const Candidate = sequelize.define('Candidate', {
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
    },
    looking_for_job: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    in_career_transition: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    career_transition_target: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    accepts_entry_level: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
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

  Candidate.associate = function(models: any) {
    Candidate.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    Candidate.hasMany(models.JobApplication, { foreignKey: 'candidate_id', as: 'applications' });
    Candidate.hasMany(models.KanbanCard, { foreignKey: 'candidate_id', as: 'kanban_cards' });
    Candidate.hasMany(models.Interview, { foreignKey: 'candidate_id', as: 'interviews' });
  };

  return Candidate;
};

export {};
