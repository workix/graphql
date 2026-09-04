const Sequelize = require('sequelize');

module.exports = function(sequelize: any, DataTypes: any) {
  return sequelize.define('Purchase', {
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
    sku: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    amount_cents: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    gateway_charge_id: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: 'pending'
    },
    credits_granted: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    credits_remaining: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    purchased_at: {
      type: DataTypes.DATE,
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
    tableName: 'purchases'
  });
};

export {};
