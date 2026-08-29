'use strict';
const fs = require('fs');
const path = require('path');

const sqlCompaniesMedias = fs.readFileSync(path.resolve(__dirname, 'companies_medias.sql'), 'utf8');

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(transaction => {
      return Promise.all([
        queryInterface.sequelize.query(sqlCompaniesMedias, { transaction }),        
      ])
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(transaction => {
      return Promise.all([        
        queryInterface.bulkDelete('companies_medias', {}, { transaction })
      ])
    })

  }
};
export {};
