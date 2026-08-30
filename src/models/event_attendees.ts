module.exports = function(sequelize: any, DataTypes: any) {
  const EventAttendee = sequelize.define('EventAttendee', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    event_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'ATTENDING'
    }
  }, {
    tableName: 'event_attendees',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return EventAttendee;
};

export {};
