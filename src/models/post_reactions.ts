module.exports = function(sequelize: any, DataTypes: any) {
  const PostReaction = sequelize.define('PostReaction', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    post_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    tableName: 'post_reactions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return PostReaction;
};

export {};
