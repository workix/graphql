'use strict';
module.exports = (sequelize, DataTypes) => {
  const Configuration = sequelize.define('Configuration', {
    version: DataTypes.STRING
  }, {});
  Configuration.associate = function(models) {
    // associations can be defined here
  };
  return Configuration;
};