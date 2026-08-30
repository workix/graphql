module.exports = function(sequelize: any, DataTypes: any) {
  const ConnectionRequest = sequelize.define('ConnectionRequest', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    requester_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    recipient_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'PENDING'
    }
  }, {
    tableName: 'connection_requests',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return ConnectionRequest;
};

export {};
