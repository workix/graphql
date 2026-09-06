const Sequelize = require('sequelize');

module.exports = function(sequelize: any, DataTypes: any) {
  const KanbanStage = sequelize.define('KanbanStage', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    uuid: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4
    },
    company_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    job_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'jobs',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    color: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: '#3B82F6'
    },
    color_hex: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: '#3B82F6'
    },
    order_position: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1
    },
    stage_order: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1
    },
    is_system_stage: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    is_final: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    }
  }, {
    tableName: 'kanban_stages',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  KanbanStage.associate = function(models: any) {
    KanbanStage.hasMany(models.KanbanCard, { foreignKey: 'stage_id', as: 'cards' });
    KanbanStage.belongsTo(models.Job, { foreignKey: 'job_id', as: 'job' });
    KanbanStage.belongsTo(models.Company, { foreignKey: 'company_id', as: 'company' });
  };

  return KanbanStage;
};

export {};
