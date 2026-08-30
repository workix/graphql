module.exports = function(sequelize: any, DataTypes: any) {
  const PostHashtag = sequelize.define('PostHashtag', {
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
    hashtag_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  }, {
    tableName: 'post_hashtags',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });

  return PostHashtag;
};

export {};
