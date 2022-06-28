/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Company', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    uuid: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    mobilePhone: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    city: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    estate: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    neighborhood: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    number: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    street: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    zipCode: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    cnpj: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    logo: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    segment: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id'
      },
      unique: true
    }
  }, {
    tableName: 'companies'
  });
};
