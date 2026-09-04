const Sequelize = require('sequelize');

module.exports = function(sequelize: any, DataTypes: any) {
  const Invoice = sequelize.define('Invoice', {
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
    subscription_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'subscriptions',
        key: 'id'
      }
    },
    amount_cents: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: 'open'
    },
    gateway_invoice_id: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    nfse_number: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    nfse_url: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    due_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    paid_at: {
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
    tableName: 'invoices'
  });

  Invoice.associate = function(models: any) {
    Invoice.belongsTo(models.Subscription, {
      foreignKey: 'subscription_id',
      as: 'subscription'
    });
  };

  return Invoice;
};

export {};
