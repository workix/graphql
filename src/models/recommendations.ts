module.exports = function(sequelize: any, DataTypes: any) {
  const Recommendation = sequelize.define('Recommendation', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    recommender_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    recipient_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'PENDING'
    }
  }, {
    tableName: 'recommendations',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Recommendation;
};

export {};
