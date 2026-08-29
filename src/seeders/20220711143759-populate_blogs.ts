'use strict';
const fs = require('fs');
const path = require('path');

const sqlBlogs = fs.readFileSync(path.resolve(__dirname, 'blogs.sql'), 'utf8');

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(transaction => {
      return Promise.all([
        queryInterface.sequelize.query(sqlBlogs, { transaction }),        
      ])
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(transaction => {
      return Promise.all([        
        queryInterface.bulkDelete('blogs', {}, { transaction })
      ])
    })

  }
};
export {};
