/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('resume_educations', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'resume',
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
    tableName: 'resume_educations'
  });
};
