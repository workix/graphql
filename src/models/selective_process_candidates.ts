/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('SelectiveProcessCandidate', {
    sp_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'selective_processes',
        key: 'id'
      }
    },
    candidate_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'candidates',
        key: 'id'
      }
    }
  }, {
    tableName: 'selective_processes_candidates',
    timestamps: false
  });
};

export {};
