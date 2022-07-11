/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ResumeExperience', {
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
    employerName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    jobTitle: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    responsibilities: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
  }, {
    tableName: 'resumes_experiences',
    timestamps: false
  });
};
