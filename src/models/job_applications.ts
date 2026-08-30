module.exports = function(sequelize: any, DataTypes: any) {
  const JobApplication = sequelize.define('JobApplication', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    job_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    candidate_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    resume_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'SUBMITTED'
    },
    match_score: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0.0
    }
  }, {
    tableName: 'job_applications',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return JobApplication;
};

export {};
