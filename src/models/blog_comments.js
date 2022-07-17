/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('BlogComment', {
    blog_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Blog',
        key: 'id'
      }
    },
    comment_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Comment',
        key: 'id'
      }
    },
  }, {
    tableName: 'blogs_comments',
    timestamps: false
  });
};
