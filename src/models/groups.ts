module.exports = function(sequelize: any, DataTypes: any) {
  const Group = sequelize.define('Group', {
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
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    privacy: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'PUBLIC'
    },
    owner_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  }, {
    tableName: 'groups',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Group;
};

export {};
