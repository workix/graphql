const Sequelize = require('sequelize');

module.exports = function(sequelize: any, DataTypes: any) {
  const PlanFeature = sequelize.define('PlanFeature', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    plan_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'plans',
        key: 'id'
      }
    },
    feature_key: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    limit_value: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
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
    tableName: 'plan_features'
  });

  PlanFeature.associate = function(models: any) {
    PlanFeature.belongsTo(models.Plan, {
      foreignKey: 'plan_id',
      as: 'plan'
    });
  };

  return PlanFeature;
};

export {};
