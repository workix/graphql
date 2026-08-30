module.exports = function(sequelize: any, DataTypes: any) {
  const JobPosting = sequelize.define('JobPosting', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    company_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    work_type: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    required_skills: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'job_postings',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return JobPosting;
};

export {};
