const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");

const allAlbums = (req, res) => {
  const { category_id } = req.query;

  if (category_id) {
    const sql = "SELECT * FROM albums WHERE category_id = ?";
    conn.query(sql, category_id, (err, results) => {
      if (err) {
        console.log(err);
        res.status(StatusCodes.BAD_REQUEST).end();
      }
      if (results.length !== 0) {
        res.status(StatusCodes.OK).json(results[0]);
      } else {
        res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "해당 카테고리의 앨범 데이터가 없습니다." });
      }
    });
  } else {
    const sql = "SELECT * FROM albums";
    conn.query(sql, (err, results) => {
      if (err) {
        console.log(err);
        res.status(StatusCodes.BAD_REQUEST).end();
      }
      res.status(StatusCodes.OK).json(results);
    });
  }
};

const albumDetail = (req, res) => {
  const { id } = req.params;

  const sql = `SELECT * FROM albums LEFT JOIN categories
    ON albums.category_id = categories.id WHERE albums.id = ?`;
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

module.exports = { allAlbums, albumDetail };
