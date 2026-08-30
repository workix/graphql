module.exports = function(sequelize: any, DataTypes: any) {
  const Follow = sequelize.define('Follow', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    follower_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    following_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  }, {
    tableName: 'follows',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Follow;
};

export {};
