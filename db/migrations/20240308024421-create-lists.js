'use strict';
const { LIST_TABLE, ListSchema } = require('../models/list.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(LIST_TABLE, ListSchema);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(LIST_TABLE);
  },
};
