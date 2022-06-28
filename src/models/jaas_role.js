/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('JAASRole', {
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true
    }
  }, {
    tableName: 'JAAS_Role'
  });
};
