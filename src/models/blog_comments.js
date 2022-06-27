/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('BlogComment', {
    Blog_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Blog',
        key: 'id'
      }
    },
    comments_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Comment',
        key: 'id'
      }
    },
  }, {
    tableName: 'blogs_comments'
  });
};
