/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('jaas_role', {
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true
    }
  }, {
    tableName: 'jaas_role'
  });
};
