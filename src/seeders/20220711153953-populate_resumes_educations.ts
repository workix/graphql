'use strict';
const fs = require('fs');
const path = require('path');

const sqlResumesEducations = fs.readFileSync(path.resolve(__dirname, 'resumes_educations.sql'), 'utf8');

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(transaction => {
      return Promise.all([
        queryInterface.sequelize.query(sqlResumesEducations, { transaction }),        
      ])
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(transaction => {
      return Promise.all([        
        queryInterface.bulkDelete('resumes_educations', {}, { transaction })
      ])
    })

  }
};
export {};
