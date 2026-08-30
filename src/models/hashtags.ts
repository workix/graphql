module.exports = function(sequelize: any, DataTypes: any) {
  const Hashtag = sequelize.define('Hashtag', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    tag: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    }
  }, {
    tableName: 'hashtags',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });

  return Hashtag;
};

export {};
