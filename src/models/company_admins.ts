module.exports = function(sequelize: any, DataTypes: any) {
  const CompanyAdmin = sequelize.define('CompanyAdmin', {
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
    },
    role: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'ADMIN'
    }
  }, {
    tableName: 'company_admins',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return CompanyAdmin;
};

export {};
