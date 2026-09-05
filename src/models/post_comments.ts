module.exports = function(sequelize: any, DataTypes: any) {
  const PostComment = sequelize.define('PostComment', {
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
    author_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    parent_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  }, {
    tableName: 'post_comments',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  PostComment.associate = function(models: any) {
    if (models.PostComment) {
      PostComment.belongsTo(models.PostComment, { foreignKey: 'parent_id', as: 'parent' });
      PostComment.hasMany(models.PostComment, { foreignKey: 'parent_id', as: 'replies' });
    }
    if (models.User) {
      PostComment.belongsTo(models.User, { foreignKey: 'author_id', as: 'author' });
    }
    if (models.Post) {
      PostComment.belongsTo(models.Post, { foreignKey: 'post_id', as: 'post' });
    }
  };

  return PostComment;
};

export {};
