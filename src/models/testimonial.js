/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Testimonial', {
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
    picture: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    signature: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false
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
    tableName: 'testimonials'
  });
};
