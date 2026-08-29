'use strict';
const fs = require('fs');
const path = require('path');

const sqlResumesExperiences = fs.readFileSync(path.resolve(__dirname, 'resumes_experiences.sql'), 'utf8');

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(transaction => {
      return Promise.all([
        queryInterface.sequelize.query(sqlResumesExperiences, { transaction }),        
      ])
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(transaction => {
      return Promise.all([        
        queryInterface.bulkDelete('resumes_experiences', {}, { transaction })
      ])
    })

  }
};
export {};
