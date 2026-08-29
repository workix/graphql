'use strict';
const fs = require('fs');
const path = require('path');

const sqlCandidates = fs.readFileSync(path.resolve(__dirname, 'candidates.sql'), 'utf8');

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(transaction => {
      return Promise.all([
        queryInterface.sequelize.query(sqlCandidates, { transaction }),        
      ])
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(transaction => {
      return Promise.all([        
        queryInterface.bulkDelete('candidates', {}, { transaction })
      ])
    })

  }
};
export {};
