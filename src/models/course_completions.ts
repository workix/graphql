module.exports = function(sequelize: any, DataTypes: any) {
  const CourseCompletion = sequelize.define('CourseCompletion', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    enrollment_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    completed_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    certificate_url: {
      type: DataTypes.STRING(512),
      allowNull: true
    }
  }, {
    tableName: 'course_completions',
    timestamps: false
  });

  return CourseCompletion;
};

export {};
