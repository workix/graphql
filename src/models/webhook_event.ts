const Sequelize = require('sequelize');

module.exports = function(sequelize: any, DataTypes: any) {
  return sequelize.define('WebhookEvent', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    gateway: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    gateway_event_id: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true
    },
    type: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    payload_json: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    received_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    },
    processed_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    error: {
      type: DataTypes.TEXT,
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
    tableName: 'webhook_events'
  });
};

export {};
