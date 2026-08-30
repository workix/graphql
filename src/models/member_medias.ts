/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('MemberMedia', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'members',
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
    tableName: 'members_medias',
    timestamps: false
  });
};

export {};
