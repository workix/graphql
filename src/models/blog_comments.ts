/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('BlogComment', {
    blog_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'blogs',
        key: 'id'
      }
    },
    comment_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'comments',
        key: 'id'
      }
    },
  }, {
    tableName: 'blogs_comments',
    timestamps: false
  });
};

export {};
