'use strict';
const fs = require('fs');
const path = require('path');

const sqlMembersMedias = fs.readFileSync(path.resolve(__dirname, 'members_medias.sql'), 'utf8');

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(transaction => {
      return Promise.all([
        queryInterface.sequelize.query(sqlMembersMedias, { transaction }),        
      ])
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(transaction => {
      return Promise.all([        
        queryInterface.bulkDelete('members_medias', {}, { transaction })
      ])
    })

  }
};
export {};
