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
    }
  }, {
    tableName: 'courses',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Course;
};

export {};
