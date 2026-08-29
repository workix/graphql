'use strict';
const fs = require('fs');
const path = require('path');

const sqlMembers = fs.readFileSync(path.resolve(__dirname, 'members.sql'), 'utf8');

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(transaction => {
      return Promise.all([
        queryInterface.sequelize.query(sqlMembers, { transaction }),        
      ])
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(transaction => {
      return Promise.all([        
        queryInterface.bulkDelete('members', {}, { transaction })
      ])
    })

  }
};
export {};
