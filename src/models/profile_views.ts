module.exports = function(sequelize: any, DataTypes: any) {
  const ProfileView = sequelize.define('ProfileView', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    viewed_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    viewer_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    viewed_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'profile_views',
    timestamps: false
  });

  return ProfileView;
};

export {};
