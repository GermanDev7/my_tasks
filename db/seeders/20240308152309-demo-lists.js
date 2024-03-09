'use strict';
const { faker } = require('@faker-js/faker');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const users = await queryInterface.sequelize.query(
      `SELECT id FROM users;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const lists = [];

    for (let user of users) {
      for (let i = 0; i < 2; i++) {
        lists.push({
          name: faker.commerce.department(),
          description: faker.internet.email(),
          date: faker.date.between({
            from: '2024-01-01T00:00:00.000Z',
            to: '2030-12-12T00:00:00.000Z',
          }),
          completed: false,
          user_id: user.id,
          created_at: new Date(),
          updated_at: new Date(),
        });
      }
    }
    await queryInterface.bulkInsert('lists', lists, {
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
