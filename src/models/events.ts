module.exports = function(sequelize: any, DataTypes: any) {
  const Event = sequelize.define('Event', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    event_type: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'ONLINE'
    },
    start_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    end_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    location_or_url: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    organizer_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  }, {
    tableName: 'events',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Event;
};

export {};
