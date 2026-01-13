import { Sequelize } from "sequelize";

let sequelize = null;
let connected = false;

/**
 * Establish connection to MariaDB using Sequelize.
 * @returns {Promise<boolean>} true if connected, false otherwise
 */
async function establishConnection() {
  try {
    const dbHost = process.env.DB_HOST || "127.0.0.1";
    const dbPort = Number(process.env.DB_PORT || 3306);
    const dbName = process.env.DB_NAME;
    const dbUser = process.env.DB_USER || "root";
    const dbPassword = process.env.DB_PASSWORD || "";

    console.log("🔍 DB CONFIG:", {
      host: dbHost,
      port: dbPort,
      name: dbName,
      user: dbUser,
      hasPassword: Boolean(dbPassword),
    });

    sequelize = new Sequelize(dbName, dbUser, dbPassword, {
      host: dbHost,
      port: dbPort,
      dialect: "mariadb",
      logging: false, // βάλε console.log αν θες να βλέπεις queries
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    });

    await sequelize.authenticate();
    console.log("✅ Connected to MariaDB");

    // ✅ Safe SELECT (avoids the "Cannot delete property 'meta'..." issue)
    const rows = await sequelize.query(
      "SELECT DATABASE() AS db, VERSION() AS version",
      { type: Sequelize.QueryTypes.SELECT }
    );
    console.log("✅ DB CHECK:", rows[0]);

    // Extra certainty (optional)
    const comment = await sequelize.query(
      "SELECT @@version_comment AS comment",
      { type: Sequelize.QueryTypes.SELECT }
    );
    console.log("✅ VERSION COMMENT:", comment[0]?.comment);

    connected = true;
    return true;
  } catch (error) {
    console.error("❌ Failed to connect to MariaDB:", error.message);
    connected = false;
    return false;
  }
}

/**
 * Connect to MariaDB.
 * Falls back to in-memory mock data if DB_NAME missing or connection fails.
 */
export async function connectDatabase() {
  if (!process.env.DB_NAME) {
    console.warn("⚠️ DB_NAME not provided: running with in-memory mock data only.");
    connected = false;
    sequelize = null;
    return;
  }

  const ok = await establishConnection();
  if (!ok) {
    console.warn("⚠️ Falling back to in-memory mock data.");
  }
}

/**
 * Check if database connection is active
 */
export function isDbConnected() {
  return connected;
}

/**
 * Get Sequelize instance
 */
export function getSequelize() {
  return sequelize;
}
