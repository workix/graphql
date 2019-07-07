/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('blog_pictures', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'blog',
        key: 'id'
      }
    },
    pictures: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    tableName: 'blog_pictures'
  });
};
