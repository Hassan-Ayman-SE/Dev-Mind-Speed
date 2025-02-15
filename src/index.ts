import dotenv from "dotenv";
import sequelize from "./utils/sequelize"; 
import app from "./app";

dotenv.config();

const PORT = process.env.PORT || 6000;

(async () => {
  try {
    
    await sequelize.authenticate();
    console.log("Connected to MySQL");

    await sequelize.sync();

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}/`);
    });
  } catch (err) {
    console.error("DB connection error:", err);
    process.exit(1);
  }
})();
