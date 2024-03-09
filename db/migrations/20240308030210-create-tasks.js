'use strict';

const { TASK_TABLE, TaskSchema } = require('../models/task.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(TASK_TABLE, TaskSchema);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(TASK_TABLE);
  },
};
