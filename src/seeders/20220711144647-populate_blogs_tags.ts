'use strict';
const fs = require('fs');
const path = require('path');

const sqlBlogsTags = fs.readFileSync(path.resolve(__dirname, 'blogs_tags.sql'), 'utf8');

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(transaction => {
      return Promise.all([
        queryInterface.sequelize.query(sqlBlogsTags, { transaction }),        
      ])
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(transaction => {
      return Promise.all([        
        queryInterface.bulkDelete('blogs_tags', {}, { transaction })
      ])
    })

  }
};
export {};
