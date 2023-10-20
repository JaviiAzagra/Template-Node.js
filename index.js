//! Modules import
// Minimal and flexible Node.js web application framework -- https://expressjs.com/
const express = require("express");
// Powerful media API for websites and mobile apps -- https://www.npmjs.com/package/cloudinary
const cloudinary = require("cloudinary").v2;
// Package for providing a Connect/Express middleware that can be used to enable CORS with various options. -- https://expressjs.com/en/resources/middleware/cors.html
const cors = require("cors");
// Module that loads environment variables from a .env file into process.env -- https://www.npmjs.com/package/dotenv
require("dotenv").config();

const connectDb = require("./src/utils/database/db");

//! Functions import
const db = require("./src/utils/database/db");
const server = express();

//! Routes import
const indexRoutes = require("./src/api/routes/index.routes");
const testRoutes = require("./src/api/routes/test.routes");
const userRoutes = require("./src/api/routes/users.routes");

//! Enviromental variables
const DB_URL = process.env.DB_URL;
const PORT = process.env.PORT;

//! Cloudinary settings
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

//* Connect to Database
db.connectDb(DB_URL);

//* Allow connections to API from external domains
server.use(
  cors({
    origin: "*", // <-- ADD ALLOWED ORIGIN
    credentials: true,
  })
);

//* Body parser for post request except html post form
server.use(express.json({limit: "5mb"}));
//* Body parser for html post form
server.use(express.urlencoded({ extended: false }));

// //! Routes
server.use("/", indexRoutes);
server.use("/users", userRoutes);
server.use("/test", testRoutes);

server.use("*", (req, res) => {
  const error = new Error('PATH NOT FOUND! 404');
  error.status = 404;
  return res.status(error.status).json(error.message);
});

server.use((error, req, res, next) => {
  return res.status(error.status || 500).json(error.message || "unexpected error");
});

server.listen(PORT || 3000, () => {
  console.log(`Server running on --> http://localhost:${PORT}`);
});
