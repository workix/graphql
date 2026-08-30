module.exports = function(sequelize: any, DataTypes: any) {
  const UserSubscription = sequelize.define('UserSubscription', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    plan_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'ACTIVE'
    },
    inmail_credits_remaining: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    started_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'user_subscriptions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return UserSubscription;
};

export {};
