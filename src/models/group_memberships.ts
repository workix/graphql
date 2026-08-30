module.exports = function(sequelize: any, DataTypes: any) {
  const GroupMembership = sequelize.define('GroupMembership', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    group_id: {
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
      defaultValue: 'MEMBER'
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'APPROVED'
    }
  }, {
    tableName: 'group_memberships',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return GroupMembership;
};

export {};
