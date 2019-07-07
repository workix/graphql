/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('selective_process', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    disabledAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    expire: {
      type: DataTypes.DATE,
      allowNull: true
    },
    maxCandidates: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    start: {
      type: DataTypes.DATE,
      allowNull: true
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
    job_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'job',
        key: 'id'
      }
    }
  }, {
    tableName: 'selective_process'
  });
};
