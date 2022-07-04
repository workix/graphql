/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('JobCandidate', {
    Job_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Job',
        key: 'id'
      }
    },
    candidates_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Candidate',
        key: 'id'
      }
    }
  }, {
    tableName: 'jobs_candidates',
    timestamps: false
  });
};
