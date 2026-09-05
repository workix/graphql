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
    },
    section_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: 'Módulo Principal'
    },
    content_type: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'VIDEO'
    },
    video_url: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    attachment_url: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    attachment_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    duration_minutes: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 10
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'course_lessons',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });

  CourseLesson.associate = function(models: any) {
    if (models.Course) {
      CourseLesson.belongsTo(models.Course, { foreignKey: 'course_id', as: 'course' });
    }
  };

  return CourseLesson;
};

export {};
