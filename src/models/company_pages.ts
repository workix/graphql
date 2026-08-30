module.exports = function(sequelize: any, DataTypes: any) {
  const CompanyPage = sequelize.define('CompanyPage', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    industry: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    size: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    logo_url: {
      type: DataTypes.STRING(512),
      allowNull: true
    },
    banner_url: {
      type: DataTypes.STRING(512),
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'company_pages',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return CompanyPage;
};

export {};
