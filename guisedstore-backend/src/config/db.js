import { Sequelize, DataTypes } from 'sequelize';
import config from './config.js';

// Create a Sequelize instance using development configuration
const sequelize = new Sequelize(config.development.database, config.development.username, config.development.password, {
  host: config.development.host,
  dialect: 'postgres',
  pool: {
    max: 20,         // Maximum number of connection in pool
    min: 5,          // Minimum number of connection in pool
    acquire: 60000,  // The maximum time, in milliseconds, that pool will try to get connection before throwing error
    idle: 10000,     // The maximum time, in milliseconds, that a connection can be idle before being released
    evict: 1000      // The time interval, in milliseconds, for evicting stale connections
  },
  retry: {
    match: [/Deadlock/i, /Connection acquire timeout/i],
    max: 3
  }
});

// Check connection
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to PostgreSQL (Sequelize)');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    process.exit(1);
  }
};

export { connectDB, sequelize, DataTypes };