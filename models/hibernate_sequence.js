/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('hibernate_sequence', {
    next_val: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  }, {
    tableName: 'hibernate_sequence'
  });
};
