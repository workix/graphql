/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Resume', {
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
    carrerLevel: {
      type: DataTypes.INTEGER,
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
    presence: {
      type: DataTypes.INTEGER,
      allowNull: true
    },  
    candidate_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'Candidate',
        key: 'id'
      },
      unique: true
    }
  }, {
    tableName: 'resumes'
  });
};
