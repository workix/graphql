const Sequelize = require('sequelize');

module.exports = function(sequelize: any, DataTypes: any) {
  const Plan = sequelize.define('Plan', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    price_cents: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    currency: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: 'BRL'
    },
    interval: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'month'
    },
    active: {
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
    tableName: 'plans'
  });

  Plan.associate = function(models: any) {
    Plan.hasMany(models.PlanFeature, {
      foreignKey: 'plan_id',
      as: 'features'
    });
    Plan.hasMany(models.Subscription, {
      foreignKey: 'plan_id',
      as: 'subscriptions'
    });
  };

  return Plan;
};

export {};
