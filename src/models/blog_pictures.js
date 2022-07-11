/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('BlogPicture', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: false,
      references: {
        model: 'Blog',
        key: 'id'
      }
    },
    pictures: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    tableName: 'blogs_pictures',
    timestamps: false
  });
};
