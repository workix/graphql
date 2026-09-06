const Sequelize = require('sequelize');

module.exports = function(sequelize: any, DataTypes: any) {
  const KanbanCard = sequelize.define('KanbanCard', {
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
    stage_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'kanban_stages',
        key: 'id'
      }
    },
    job_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'jobs',
        key: 'id'
      }
    },
    candidate_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'candidates',
        key: 'id'
      }
    },
    order_position: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    position_order: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    tags: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: '[]'
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
    tableName: 'kanban_cards',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  KanbanCard.associate = function(models: any) {
    KanbanCard.belongsTo(models.Candidate, { foreignKey: 'candidate_id', as: 'candidate' });
    KanbanCard.belongsTo(models.KanbanStage, { foreignKey: 'stage_id', as: 'stage' });
    KanbanCard.belongsTo(models.Job, { foreignKey: 'job_id', as: 'job' });
    KanbanCard.hasMany(models.KanbanCardHistory, { foreignKey: 'card_id', as: 'histories' });
  };

  return KanbanCard;
};

export {};
