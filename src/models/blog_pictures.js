/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('BlogPicture', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Blog',
        key: 'id'
      }
    },
    pictures: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    tableName: 'blogs_pictures'
  });
};
