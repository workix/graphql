const Sequelize = require('sequelize');

module.exports = function(sequelize: any, DataTypes: any) {
  const Subscription = sequelize.define('Subscription', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    organization_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    plan_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'plans',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: 'trialing'
    },
    gateway_customer_id: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    gateway_subscription_id: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    current_period_start: {
      type: DataTypes.DATE,
      allowNull: true
    },
    current_period_end: {
      type: DataTypes.DATE,
      allowNull: true
    },
    trial_ends_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    cancel_at_period_end: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    founder_discount_pct: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0.00
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
    tableName: 'subscriptions'
  });

  Subscription.associate = function(models: any) {
    Subscription.belongsTo(models.Plan, {
      foreignKey: 'plan_id',
      as: 'plan'
    });
    Subscription.hasMany(models.SubscriptionOverride, {
      foreignKey: 'subscription_id',
      as: 'overrides'
    });
    Subscription.hasMany(models.Invoice, {
      foreignKey: 'subscription_id',
      as: 'invoices'
    });
  };

  return Subscription;
};

export {};
