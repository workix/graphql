const Sequelize = require('sequelize');

module.exports = function(sequelize: any, DataTypes: any) {
  const SubscriptionOverride = sequelize.define('SubscriptionOverride', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    subscription_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'subscriptions',
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
    expires_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    reason: {
      type: DataTypes.STRING(255),
      allowNull: true
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
    tableName: 'subscription_overrides'
  });

  SubscriptionOverride.associate = function(models: any) {
    SubscriptionOverride.belongsTo(models.Subscription, {
      foreignKey: 'subscription_id',
      as: 'subscription'
    });
  };

  return SubscriptionOverride;
};

export {};
