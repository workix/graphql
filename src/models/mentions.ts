module.exports = function(sequelize: any, DataTypes: any) {
  const Mention = sequelize.define('Mention', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    post_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    mentioned_user_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  }, {
    tableName: 'mentions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });

  return Mention;
};

export {};
