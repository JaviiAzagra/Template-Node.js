const mongoose = require("mongoose");

const connectDb = async (DB_URL) => {
  try {
    const db = await mongoose.connect(DB_URL);
    const { name } = db.connection;
    console.log(`Successfully conected to db: ${name}`);
  } catch (error) {
    console.log("Error connecting to database:", error);
  }
};

module.exports = { connectDb };
