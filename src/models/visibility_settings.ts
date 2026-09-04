const Sequelize = require('sequelize');

module.exports = function(sequelize: any, DataTypes: any) {
  const VisibilitySetting = sequelize.define('VisibilitySetting', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    candidate_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true,
      references: {
        model: 'candidates',
        key: 'id'
      }
    },
    searchable_by_recruiters: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    open_to_work_visible: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    show_as_viewed: {
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
    tableName: 'visibility_settings'
  });

  VisibilitySetting.associate = function(models: any) {
    VisibilitySetting.belongsTo(models.Candidate, {
      foreignKey: 'candidate_id',
      as: 'candidate'
    });
  };

  return VisibilitySetting;
};

export {};
