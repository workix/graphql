/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('AuthorMedia', {
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
      allowNull: false
    },
    url: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    tableName: 'authors_medias',
    timestamps: false
  });
};
