/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('jaas_user', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    login: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    tableName: 'jaas_user'
  });
};
