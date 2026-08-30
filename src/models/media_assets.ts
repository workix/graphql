module.exports = function(sequelize: any, DataTypes: any) {
  const MediaAsset = sequelize.define('MediaAsset', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    file_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    file_type: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    context: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    url: {
      type: DataTypes.STRING(512),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'PENDING'
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  }, {
    tableName: 'media_assets',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return MediaAsset;
};

export {};
