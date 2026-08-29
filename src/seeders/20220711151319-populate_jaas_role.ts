'use strict';
const fs = require('fs');
const path = require('path');

const sqlJAASRole = fs.readFileSync(path.resolve(__dirname, 'JAAS_Role.sql'), 'utf8');

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(transaction => {
      return Promise.all([
        queryInterface.sequelize.query(sqlJAASRole, { transaction }),        
      ])
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(transaction => {
      return Promise.all([        
        queryInterface.bulkDelete('JAAS_Role', {}, { transaction })
      ])
    })

  }
};
export {};
