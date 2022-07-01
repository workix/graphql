const Sequelize = require('sequelize');
/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  const Blog = sequelize.define('Blog', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true 
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('now'),
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.fn('now'),
    },
    uuid: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
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
    tableName: 'blogs',
    hooks: {
      afterCreate(instance, options){
        console.log("HOOK After create")
      },
      beforeUpdate(instance, options){
        instance.updatedAt = Date.now()
      }
    }
  });


  Blog.associate = function(models) {
    // associations can be defined here
    Blog.belongsToMany(models.Comment, {
      through: 'blogs_comments',
      foreignKey: 'Blog_id',
      otherKey: 'comments_id',
      timestamps: false
    });

    Blog.hasMany(models.BlogPicture,{
      foreignKey: 'id',
      as: "pictures"      
    });

    Blog.hasMany(models.BlogTag,{
      foreignKey: 'id',
      as: "tags"      
    });
  }

  return Blog;
};
