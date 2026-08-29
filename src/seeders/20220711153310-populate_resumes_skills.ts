'use strict';
const fs = require('fs');
const path = require('path');

const sqlResumesSkills = fs.readFileSync(path.resolve(__dirname, 'resumes_skills.sql'), 'utf8');

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(transaction => {
      return Promise.all([
        queryInterface.sequelize.query(sqlResumesSkills, { transaction }),        
      ])
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(transaction => {
      return Promise.all([        
        queryInterface.bulkDelete('resumes_skills', {}, { transaction })
      ])
    })

  }
};
export {};
