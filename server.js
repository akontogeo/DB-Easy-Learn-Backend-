import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { connectDatabase, getSequelize } from "./config/database.js";

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await connectDatabase();

    const sequelize = getSequelize();

    // ✅ Safe DB test (μην ρίχνει τον server αν ο πίνακας δεν υπάρχει)
    if (sequelize) {
      try {
        const rows = await sequelize.query(
          "SHOW TABLES",
          { type: sequelize.QueryTypes.SELECT }
        );
        console.log("📦 TABLES:", rows);

        // Αν υπάρχει πίνακας user, τότε μόνο κάνε select
        const users = await sequelize.query(
          "SELECT * FROM `user` LIMIT 5",
          { type: sequelize.QueryTypes.SELECT }
        );
        console.log("🎯 USERS RESULT:", users);
      } catch (e) {
        console.warn("⚠️ DB test query failed:", e.message);
      }
    } else {
      console.log("❌ No sequelize instance (DB not connected)");
    }

    const server = app.listen(PORT, () => {
      console.log(`EasyLearn server listening on port ${PORT}`);
    });

    server.on("error", (err) => {
      if (err?.code === "EADDRINUSE") {
        console.error(`Port ${PORT} is already in use.`);
        process.exit(1);
      }
      console.error("Server error", err);
      process.exit(1);
    });
  } catch (err) {
    console.error("Failed to start server", err);
    process.exit(1);
  }
})();
