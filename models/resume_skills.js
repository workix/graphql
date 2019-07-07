/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('resume_skills', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'resume',
        key: 'id'
      }
    },
    skillName: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    tableName: 'resume_skills'
  });
};
