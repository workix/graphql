module.exports = function(sequelize: any, DataTypes: any) {
  const Post = sequelize.define('Post', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    author_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    media_ids: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'posts',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Post;
};

export {};
