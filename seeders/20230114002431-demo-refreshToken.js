'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('RefreshTokens', [
      {
        token: "cd447ce394fb2190f61ab5ccc43785b2679ef3f5",
        user_id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
  ], {});

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('RefreshTokens', null, {});
  }
};
