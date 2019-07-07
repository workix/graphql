/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Media', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Author',
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
