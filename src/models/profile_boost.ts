const Sequelize = require('sequelize');

module.exports = function(sequelize: any, DataTypes: any) {
  const ProfileBoost = sequelize.define('ProfileBoost', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    candidate_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'candidates',
        key: 'id'
      }
    },
    subscription_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    starts_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    ends_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    label: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'Perfil em destaque'
    },
    status: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: 'active'
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.NOW
    }
  }, {
    tableName: 'profile_boosts'
  });

  ProfileBoost.associate = function(models: any) {
    ProfileBoost.belongsTo(models.Candidate, {
      foreignKey: 'candidate_id',
      as: 'candidate'
    });
  };

  return ProfileBoost;
};

export {};
