module.exports = function(sequelize: any, DataTypes: any) {
  const CourseEnrollment = sequelize.define('CourseEnrollment', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    course_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    enrolled_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'course_enrollments',
    timestamps: false
  });

  return CourseEnrollment;
};

export {};
