const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateSign = (id, email) => {
  return jwt.sign({ id, email }, process.env.JWT_SECRET, {});
};
const verifyJwt = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { generateSign, verifyJwt };
