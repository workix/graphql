/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ResumeSkill', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: false,
      references: {
        model: 'Resume',
        key: 'id'
      }
    },
    skillName: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    months: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'resumes_skills',
    timestamps: false
  });
};
