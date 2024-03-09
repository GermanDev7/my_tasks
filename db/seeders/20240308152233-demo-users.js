'use strict';
const {faker} = require('@faker-js/faker');
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const users = [];
    // Create 20 seeds for users
    for (let i = 0; i < 5; i++) {
      users.push({
        password: await bcrypt.hash('password', 10), // hash password
        email: faker.internet.email(),
        role: faker.helpers.arrayElement(['user', 'admin']),
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    await queryInterface.bulkInsert('users', users, {
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
