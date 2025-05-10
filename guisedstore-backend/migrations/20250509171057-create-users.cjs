'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      role: {
        type: Sequelize.ENUM('user', 'admin'),
        defaultValue: 'user',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    // Create initial admin user
    await queryInterface.sequelize.query(`
      INSERT INTO users (id, name, email, password, role, "createdAt", "updatedAt")
      VALUES (
        gen_random_uuid(),
        'Admin User',
        'admin@example.com',
        '$2b$10$vQoPXcgKl1W.RKEtXKqzm.TuHjR.qvzW1qZDRkuVbpGNZECtg0Qvy',
        'admin',
        NOW(),
        NOW()
      );
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  }
};
