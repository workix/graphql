module.exports = function(sequelize: any, DataTypes: any) {
  const CompanyFollower = sequelize.define('CompanyFollower', {
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
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  }, {
    tableName: 'company_followers',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return CompanyFollower;
};

export {};
