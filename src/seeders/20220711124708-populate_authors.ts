'use strict';
const { QueryTypes } = require('sequelize');
const fs = require('fs');
const path = require('path');

const sqlAuthors = fs.readFileSync(path.resolve(__dirname, 'authors.sql'), 'utf8');

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async transaction => {
      return Promise.all([        
        queryInterface.sequelize.query(sqlAuthors, {
          nest: false,
          type: QueryTypes.INSERT,
          transaction
        })
      ])
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(transaction => {
      return Promise.all([        
        queryInterface.bulkDelete('authors', {}, { transaction })
      ])
    })

  }
};
export {};
