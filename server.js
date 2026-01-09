import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connectDatabase } from './config/database.js';

const PORT = process.env.PORT || 5000;

/**
 * Main entry point for the EasyLearn backend server.
 * Loads environment variables, connects to the database, and starts the HTTP server.
 * Handles server errors such as port conflicts.
 */
(async () => {
  try {
    // Connect to the database before starting the server
    await connectDatabase();
    const server = app.listen(PORT, () => {
      console.log(`EasyLearn server listening on port ${PORT}`);
    });

    /**
     * Handle server errors, especially port conflicts (EADDRINUSE).
     * @param {Error} err - The error object
     */
    server.on('error', (err) => {
      if (err && err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Please stop the process using that port or set PORT in environment.`);
        process.exit(1);
      }
      console.error('Server error', err);
      process.exit(1);
    });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
})();
