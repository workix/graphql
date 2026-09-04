const Sequelize = require('sequelize');

module.exports = function(sequelize: any, DataTypes: any) {
  const JobBoost = sequelize.define('JobBoost', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    job_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'jobs',
        key: 'id'
      }
    },
    organization_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    source: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'plan_credit'
    },
    purchase_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    starts_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    ends_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    label: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'Patrocinada'
    },
    max_concurrent_slot: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 3
    },
    status: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: 'active'
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.NOW
    }
  }, {
    tableName: 'job_boosts'
  });

  JobBoost.associate = function(models: any) {
    JobBoost.belongsTo(models.Job, {
      foreignKey: 'job_id',
      as: 'job'
    });
  };

  return JobBoost;
};

export {};
