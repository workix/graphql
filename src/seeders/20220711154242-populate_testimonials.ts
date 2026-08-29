'use strict';
const fs = require('fs');
const path = require('path');

const sqlTestimonials = fs.readFileSync(path.resolve(__dirname, 'testimonials.sql'), 'utf8');

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(transaction => {
      return Promise.all([
        queryInterface.sequelize.query(sqlTestimonials, { transaction }),        
      ])
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(transaction => {
      return Promise.all([        
        queryInterface.bulkDelete('testimonials', {}, { transaction })
      ])
    })

  }
};
export {};
