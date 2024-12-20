const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
dotenv.config();

const connection = async () => {
  const conn = await mysql.createConnection({
    host: process.env.DB_LOCALHOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: "AlbumShop",
    dateStrings: true,
  });

  return conn;
};

module.exports = connection;
