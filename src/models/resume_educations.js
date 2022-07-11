/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ResumeEducation', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: false,
      allowNull: false,
      references: {
        model: 'Resume',
        key: 'id'
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    qualification: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    schoolName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    }
  }, {
    tableName: 'resumes_educations',
    timestamps: false
  });
};
