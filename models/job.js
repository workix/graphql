/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('job', {
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
    version: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    benefits: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    jobCategory: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    jobType: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    maxPayment: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    minPayment: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    requirement: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    company_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'company',
        key: 'id'
      }
    }
  }, {
    tableName: 'job'
  });
};
