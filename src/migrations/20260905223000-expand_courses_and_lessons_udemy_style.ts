'use strict';

module.exports = {
  up: (queryInterface: any, Sequelize: any) => {
    return queryInterface.sequelize.transaction(async (transaction: any) => {
      // Expand courses table
      const coursesTable = await queryInterface.describeTable('courses');

      if (!coursesTable.company_id) {
        await queryInterface.addColumn('courses', 'company_id', {
          type: Sequelize.DataTypes.BIGINT,
          allowNull: true
        }, { transaction });
      }

      if (!coursesTable.provider_type) {
        await queryInterface.addColumn('courses', 'provider_type', {
          type: Sequelize.DataTypes.STRING(50),
          allowNull: false,
          defaultValue: 'PLATFORM'
        }, { transaction });
      }

      if (!coursesTable.level) {
        await queryInterface.addColumn('courses', 'level', {
          type: Sequelize.DataTypes.STRING(50),
          allowNull: true,
          defaultValue: 'INTERMEDIATE'
        }, { transaction });
      }

      if (!coursesTable.category) {
        await queryInterface.addColumn('courses', 'category', {
          type: Sequelize.DataTypes.STRING(100),
          allowNull: true
        }, { transaction });
      }

      if (!coursesTable.requirements) {
        await queryInterface.addColumn('courses', 'requirements', {
          type: Sequelize.DataTypes.TEXT,
          allowNull: true
        }, { transaction });
      }

      if (!coursesTable.what_you_will_learn) {
        await queryInterface.addColumn('courses', 'what_you_will_learn', {
          type: Sequelize.DataTypes.TEXT,
          allowNull: true
        }, { transaction });
      }

      if (!coursesTable.duration_hours) {
        await queryInterface.addColumn('courses', 'duration_hours', {
          type: Sequelize.DataTypes.FLOAT,
          allowNull: true,
          defaultValue: 0
        }, { transaction });
      }

      // Expand course_lessons table
      const lessonsTable = await queryInterface.describeTable('course_lessons');

      if (!lessonsTable.section_name) {
        await queryInterface.addColumn('course_lessons', 'section_name', {
          type: Sequelize.DataTypes.STRING(255),
          allowNull: true,
          defaultValue: 'Módulo Principal'
        }, { transaction });
      }

      if (!lessonsTable.content_type) {
        await queryInterface.addColumn('course_lessons', 'content_type', {
          type: Sequelize.DataTypes.STRING(50),
          allowNull: false,
          defaultValue: 'VIDEO'
        }, { transaction });
      }

      if (!lessonsTable.video_url) {
        await queryInterface.addColumn('course_lessons', 'video_url', {
          type: Sequelize.DataTypes.TEXT,
          allowNull: true
        }, { transaction });
      }

      if (!lessonsTable.attachment_url) {
        await queryInterface.addColumn('course_lessons', 'attachment_url', {
          type: Sequelize.DataTypes.TEXT,
          allowNull: true
        }, { transaction });
      }

      if (!lessonsTable.attachment_name) {
        await queryInterface.addColumn('course_lessons', 'attachment_name', {
          type: Sequelize.DataTypes.STRING(255),
          allowNull: true
        }, { transaction });
      }

      if (!lessonsTable.duration_minutes) {
        await queryInterface.addColumn('course_lessons', 'duration_minutes', {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: true,
          defaultValue: 10
        }, { transaction });
      }

      if (!lessonsTable.description) {
        await queryInterface.addColumn('course_lessons', 'description', {
          type: Sequelize.DataTypes.TEXT,
          allowNull: true
        }, { transaction });
      }
    });
  },

  down: (queryInterface: any, Sequelize: any) => {
    return queryInterface.sequelize.transaction(async (transaction: any) => {
      const coursesTable = await queryInterface.describeTable('courses');
      const lessonsTable = await queryInterface.describeTable('course_lessons');

      const courseCols = ['company_id', 'provider_type', 'level', 'category', 'requirements', 'what_you_will_learn', 'duration_hours'];
      for (const col of courseCols) {
        if (coursesTable[col]) {
          await queryInterface.removeColumn('courses', col, { transaction });
        }
      }

      const lessonCols = ['section_name', 'content_type', 'video_url', 'attachment_url', 'attachment_name', 'duration_minutes', 'description'];
      for (const col of lessonCols) {
        if (lessonsTable[col]) {
          await queryInterface.removeColumn('course_lessons', col, { transaction });
        }
      }
    });
  }
};
