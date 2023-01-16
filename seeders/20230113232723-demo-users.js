'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        fullName: 'Lerian',
        role: 1,
        email: 'kanglerian@gmail.com',
        password: 'lerian123',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
  ], {});

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
