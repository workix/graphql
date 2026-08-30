module.exports = function(sequelize: any, DataTypes: any) {
  const Connection = sequelize.define('Connection', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_id_1: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    user_id_2: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  }, {
    tableName: 'connections',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Connection;
};

export {};
