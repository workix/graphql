/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('author_medias', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'author',
        key: 'id'
      }
    },
    media: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    url: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    tableName: 'author_medias'
  });
};
