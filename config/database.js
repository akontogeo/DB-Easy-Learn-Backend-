import { Sequelize } from 'sequelize';

let sequelize = null;
let connected = false;

/**
 * Establishes connection to MariaDB database
 * @returns {Promise<boolean>} - Returns true if connection successful, false otherwise
 */
async function establishConnection() {
  try {
    const dbHost = process.env.DB_HOST || 'localhost';
    const dbPort = process.env.DB_PORT || 3306;
    const dbName = process.env.DB_NAME || 'easylearn_db';
    const dbUser = process.env.DB_USER || 'root';
    const dbPassword = process.env.DB_PASSWORD || '';

    sequelize = new Sequelize(dbName, dbUser, dbPassword, {
      host: dbHost,
      port: dbPort,
      dialect: 'mysql',  // Using mysql2 package
      logging: false, // Set to console.log to see SQL queries
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    });

    // Test the connection
    await sequelize.authenticate();
    console.log('✅ Connected to MariaDB');

    // Note: We don't sync models as the database schema already exists
    // If you need to sync, uncomment the line below:
    // await sequelize.sync({ alter: false });
    
    console.log('✅ Using existing database schema');

    return true;
  } catch (error) {
    console.error('❌ Failed to connect to MariaDB:', error.message);
    return false;
  }
}

/**
 * Connect to MariaDB.
 * Falls back to in-memory mock data if database connection fails.
 * @returns {Promise<void>}
 */
export async function connectDatabase() {
  const dbName = process.env.DB_NAME;
  
  // Check if database name is provided
  if (!dbName) {
    console.warn('⚠️  DB_NAME not provided: running with in-memory mock data only.');
    connected = false;
    return;
  }
  
  // Attempt to connect to MariaDB
  connected = await establishConnection();
  
  if (!connected) {
    console.warn('⚠️  Falling back to in-memory mock data.');
  }
}

/**
 * Check if database connection is active
 * @returns {boolean} - True if connected to MariaDB, false otherwise
 */
export function isDbConnected() {
  return connected;
}

/**
 * Get Sequelize instance
 * @returns {Sequelize|null} - Sequelize instance or null if not connected
 */
export function getSequelize() {
  return sequelize;
}