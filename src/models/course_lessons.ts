module.exports = function(sequelize: any, DataTypes: any) {
  const CourseLesson = sequelize.define('CourseLesson', {
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
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    media_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    order_index: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    tableName: 'course_lessons',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });

  return CourseLesson;
};

export {};
