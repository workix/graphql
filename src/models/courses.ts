module.exports = function(sequelize: any, DataTypes: any) {
  const Course = sequelize.define('Course', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    instructor_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    media_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    company_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    provider_type: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'PLATFORM'
    },
    level: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: 'INTERMEDIATE'
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    requirements: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    what_you_will_learn: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    duration_hours: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0
    }
  }, {
    tableName: 'courses',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Course.associate = function(models: any) {
    if (models.Company) {
      Course.belongsTo(models.Company, { foreignKey: 'company_id', as: 'company' });
    }
    if (models.User) {
      Course.belongsTo(models.User, { foreignKey: 'instructor_id', as: 'instructor' });
    }
    if (models.CourseLesson) {
      Course.hasMany(models.CourseLesson, { foreignKey: 'course_id', as: 'lessons' });
    }
  };

  return Course;
};

export {};
