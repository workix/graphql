/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('resume', {
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
    content: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    objective: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    candidate_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'candidate',
        key: 'id'
      },
      unique: true
    }
  }, {
    tableName: 'resume'
  });
};
