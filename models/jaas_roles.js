/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('jaas_roles', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'jaas_user',
        key: 'id'
      }
    },
    role_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'jaas_role',
        key: 'name'
      }
    }
  }, {
    tableName: 'jaas_roles'
  });
};
