'use strict';
const fs = require('fs');
const path = require('path');

const sqlUsers = fs.readFileSync(path.resolve(__dirname, 'users.sql'), 'utf8');

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(transaction => {
      return Promise.all([
        queryInterface.sequelize.query(sqlUsers, { transaction }),        
      ])
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(transaction => {
      return Promise.all([        
        queryInterface.bulkDelete('users', {}, { transaction })
      ])
    })

  }
};