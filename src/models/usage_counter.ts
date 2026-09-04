const Sequelize = require('sequelize');

module.exports = function(sequelize: any, DataTypes: any) {
  return sequelize.define('UsageCounter', {
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
    feature_key: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    period_start: {
      type: DataTypes.DATE,
      allowNull: false
    },
    period_end: {
      type: DataTypes.DATE,
      allowNull: false
    },
    used: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
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
    tableName: 'usage_counters'
  });
};

export {};
