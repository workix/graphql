module.exports = function(sequelize: any, DataTypes: any) {
  const SocialSellingScore = sequelize.define('SocialSellingScore', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    posts_score: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    network_score: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    engagement_score: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    relationships_score: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    calculated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'social_selling_scores',
    timestamps: false
  });

  return SocialSellingScore;
};

export {};
