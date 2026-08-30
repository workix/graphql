module.exports = function(sequelize: any, DataTypes: any) {
  const FeaturedItem = sequelize.define('FeaturedItem', {
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
    type: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    url: {
      type: DataTypes.STRING(512),
      allowNull: true
    },
    media_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  }, {
    tableName: 'featured_items',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return FeaturedItem;
};

export {};
