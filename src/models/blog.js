/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Blog', {
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
    category: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    citation: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    resume: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    author_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'Author',
        key: 'id'
      }
    }
  }, {
    tableName: 'blogs'
  });
};
