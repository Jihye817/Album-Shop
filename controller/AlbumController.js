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

const albumDetail = (req, res) => {
  const { id } = req.params;

  const sql = "SELECT * FROM albums WHERE id = ?";
  conn.query(sql, id, (err, results) => {
    if (err) {
      console.log(err);
      res.status(StatusCodes.BAD_REQUEST).end();
    }
    if (results[0]) {
      res.status(StatusCodes.OK).json(results[0]);
    } else {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "해당 id의 앨범 데이터가 없습니다." });
    }
  });
};

const albumsByCategory = (req, res) => {};

module.exports = { allAlbums, albumDetail, albumsByCategory };
