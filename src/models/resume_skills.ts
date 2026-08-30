/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ResumeSkill', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'resumes',
        key: 'id'
      }
    },
    skill_name: {
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

export {};
