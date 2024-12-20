const mysql = require("mysql2");
const dotenv = require("dotenv");
dotenv.config();

const connection = mysql.createConnection({
  host: process.env.DB_LOCALHOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: "AlbumShop",
  dateStrings: true,
});

module.exports = connection;
