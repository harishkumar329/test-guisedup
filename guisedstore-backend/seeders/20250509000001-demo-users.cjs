'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPasswords = await Promise.all([
      bcrypt.hash('admin123', 10),
      bcrypt.hash('harish123', 10),
      bcrypt.hash('swarah123', 10)
    ]);

    return queryInterface.bulkInsert('users', [
      {
        id: Sequelize.literal('gen_random_uuid()'),
        name: 'Admin',
        email: 'admin@guisedup.com',
        password: hashedPasswords[0],
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: Sequelize.literal('gen_random_uuid()'),
        name: 'Harish Kumar',
        email: 'harish@guisedup.com',
        password: hashedPasswords[1],
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: Sequelize.literal('gen_random_uuid()'),
        name: 'Swarah',
        email: 'swarah@guisedup.com',
        password: hashedPasswords[2],
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  }
};
