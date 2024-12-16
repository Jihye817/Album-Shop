const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");

const allAlbums = (req, res) => {
  const { category_id, newAlbum, limit, currentPage } = req.query;

  let offset = limit * (currentPage - 1);
  let sql =
    "SELECT *, (SELECT count(*) FROM likes WHERE liked_album_id=albums.id) AS likes FROM albums ";
  let values = [parseInt(limit), offset];

  if (category_id && newAlbum) {
    sql += `WHERE category_id = ? AND pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 30 DAY) AND NOW()`;
    values = [category_id, ...values];
  } else if (category_id) {
    sql += "WHERE category_id = ? ";
    values = [category_id, ...values];
  } else if (newAlbum) {
    sql += `WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 30 DAY) AND NOW() `;
  }

  sql += "LIMIT ? OFFSET ? ";

  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      res.status(StatusCodes.BAD_REQUEST).end();
    }

    if (results.length !== 0) {
      res.status(StatusCodes.OK).json(results);
    } else {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "해당하는 앨범 데이터가 없습니다." });
    }
  });
};

const albumDetail = (req, res) => {
  const album_id = req.params.id;
  let { user_id } = req.body;

  const sql = `SELECT *,
    (SELECT count(*) FROM likes WHERE liked_album_id = albums.id) AS likes,
    (SELECT EXISTS (SELECT * FROM likes WHERE user_id = ? AND liked_album_id = ?)) AS liked
    FROM albums
    LEFT JOIN categories
    ON albums.category_id = categories.category_id
    WHERE albums.id = ?;`;
  const values = [user_id, album_id, album_id];
  conn.query(sql, values, (err, results) => {
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
