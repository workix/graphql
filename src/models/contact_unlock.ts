const Sequelize = require('sequelize');

module.exports = function(sequelize: any, DataTypes: any) {
  const ContactUnlock = sequelize.define('ContactUnlock', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    organization_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    candidate_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'candidates',
        key: 'id'
      }
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    credit_source: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'plan_credit'
    },
    unlocked_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    },
    notified_candidate_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
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
    tableName: 'contact_unlocks'
  });

  ContactUnlock.associate = function(models: any) {
    ContactUnlock.belongsTo(models.Candidate, {
      foreignKey: 'candidate_id',
      as: 'candidate'
    });
    ContactUnlock.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
  };

  return ContactUnlock;
};

export {};
