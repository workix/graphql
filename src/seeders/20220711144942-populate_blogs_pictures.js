'use strict';
const fs = require('fs');
const path = require('path');

const sqlBlogsPictures = fs.readFileSync(path.resolve(__dirname, 'blogs_pictures.sql'), 'utf8');

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(transaction => {
      return Promise.all([
        queryInterface.sequelize.query(sqlBlogsPictures, { transaction }),        
      ])
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(transaction => {
      return Promise.all([        
        queryInterface.bulkDelete('blogs_pictures', {}, { transaction })
      ])
    })

  }
};