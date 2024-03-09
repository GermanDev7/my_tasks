'use strict';
const { faker } = require('@faker-js/faker');


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const lists = await queryInterface.sequelize.query(
      `SELECT id FROM lists;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    const tasks = [];

    for (let list of lists) {
      tasks.push({
        name: faker.commerce.department(), // hash password
        tema: faker.internet.email(),
        initial_date: faker.date.between({
          from: '2024-01-01T00:00:00.000Z',
          to: '2030-12-12T00:00:00.000Z',
        }),
        final_date: faker.date.between({
          from: '2024-01-01T00:00:00.000Z',
          to: '2030-12-12T00:00:00.000Z',
        }),
        complete: false,
        list_id: list.id,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    await queryInterface.bulkInsert('tasks', tasks, {
      returning: true,
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
