module.exports = function(sequelize: any, DataTypes: any) {
  const SubscriptionPlan = sequelize.define('SubscriptionPlan', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    billing_period: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'MONTHLY'
    },
    inmail_credits_per_month: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    tableName: 'subscription_plans',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return SubscriptionPlan;
};

export {};
