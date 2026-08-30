const Sequelize = require('sequelize');
/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  const JAASRoles = sequelize.define('JAASRoles', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: false,
      references: {
        model: 'jaas_user',
        key: 'id'
      }
    },
    role_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'jaas_role',
        key: 'name'
      }
    }
  }, {
    tableName: 'jaas_roles',
    timestamps: false
  });

  JAASRoles.associate = function(models) {
    JAASRoles.belongsToMany(models.JAASUser, {
      through: models.JAASRoles,
      foreignKey: 'id',
      otherKey: 'role_name',
      timestamps: false,
    })
  }

  return JAASRoles;
};

export {};
