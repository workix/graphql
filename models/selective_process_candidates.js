/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('selective_process_candidates', {
    sp_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'selective_process',
        key: 'id'
      }
    },
    candidate_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'candidate',
        key: 'id'
      }
    }
  }, {
    tableName: 'selective_process_candidates'
  });
};
