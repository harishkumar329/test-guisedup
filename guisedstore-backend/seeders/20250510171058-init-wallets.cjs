'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Get existing users
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    // Create wallets for each user with 0 balance
    const wallets = users.map(user => ({
      id: Sequelize.literal('gen_random_uuid()'),
      userId: user.id,
      balance: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    return queryInterface.bulkInsert('wallets', wallets);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('wallets', null, {});
  }
};
