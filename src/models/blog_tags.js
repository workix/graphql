/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('BlogTag', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: false,
      allowNull: false,
      references: {
        model: 'Blog',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    tableName: 'blogs_tags',
    timestamps: false
  });
};
