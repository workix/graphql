'use strict';
const fs = require('fs');
const path = require('path');

const sqlJobs = fs.readFileSync(path.resolve(__dirname, 'jobs.sql'), 'utf8');

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(transaction => {
      return Promise.all([
        queryInterface.sequelize.query(sqlJobs, { transaction }),        
      ])
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(transaction => {
      return Promise.all([        
        queryInterface.bulkDelete('jobs', {}, { transaction })
      ])
    })

  }
};
export {};
