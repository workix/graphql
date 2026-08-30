module.exports = function(sequelize: any, DataTypes: any) {
  const UserProfile = sequelize.define('UserProfile', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    headline: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    about: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    banner_url: {
      type: DataTypes.STRING(512),
      allowNull: true
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    industry: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    open_to_work: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    tableName: 'user_profiles',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return UserProfile;
};

export {};
