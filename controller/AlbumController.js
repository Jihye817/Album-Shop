const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");

const allAlbums = (req, res) => {
  const sql = "SELECT * FROM albums";
  conn.query(sql, (err, results) => {
    if (err) {
      console.log(err);
      res.status(StatusCodes.BAD_REQUEST).end();
    }
    res.status(StatusCodes.OK).json(results);
  });
};

const albumDetail = (req, res) => {};

const albumsByCategory = (req, res) => {};

module.exports = { allAlbums, albumDetail, albumsByCategory };
