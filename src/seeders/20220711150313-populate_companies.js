'use strict';
const fs = require('fs');
const path = require('path');

const sqlCompanies = fs.readFileSync(path.resolve(__dirname, 'companies.sql'), 'utf8');

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(transaction => {
      return Promise.all([
        queryInterface.sequelize.query(sqlCompanies, { transaction }),        
      ])
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(transaction => {
      return Promise.all([        
        queryInterface.bulkDelete('companies', {}, { transaction })
      ])
    })

  }
};