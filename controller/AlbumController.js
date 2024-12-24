const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");
const ensureAuthorization = require("../auth");
const jwt = require("jsonwebtoken");

const allAlbums = (req, res) => {
  let allAlbumsRes = {};
  const { category_id, newAlbum, limit, currentPage } = req.query;

  let offset = limit * (currentPage - 1);
  let sql =
    "SELECT SQL_CALC_FOUND_ROWS *, (SELECT count(*) FROM likes WHERE liked_album_id=albums.id) AS likes FROM albums ";
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
      // res.status(StatusCodes.BAD_REQUEST).end();
    }
    console.log(results);
    if (results.length !== 0) {
      allAlbumsRes.books = results;
    } else {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "해당하는 앨범 데이터가 없습니다." });
    }
  });

  sql = "SELECT found_rows()";
  conn.query(sql, (err, results) => {
    if (err) {
      console.log(err);
      res.status(StatusCodes.BAD_REQUEST).end();
    } else {
      let totalCount = results[0]["found_rows()"];
      let pagination = {};
      pagination.currentPage = currentPage;
      pagination.totalCount = totalCount;
      allAlbumsRes.pagination = pagination;

      return res.status(StatusCodes.OK).json(allAlbumsRes);
    }
  });
};

const albumDetail = (req, res) => {
  const authorization = ensureAuthorization(req);

  if (authorization instanceof jwt.TokenExpiredError) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "로그인 세션이 만료되었습니다." });
  } else if (authorization instanceof jwt.JsonWebTokenError) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "유효하지 않은 토큰입니다." });
  } else if (authorization instanceof ReferenceError) {
    const album_id = req.params.id;
    const sql = `SELECT *,
      (SELECT count(*) FROM likes WHERE liked_album_id = albums.id) AS likes 
      FROM albums
      LEFT JOIN categories
      ON albums.category_id = categories.category_id
      WHERE albums.id = ?;`;
    const values = [album_id];
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
  } else {
    const album_id = req.params.id;

    const sql = `SELECT *,
      (SELECT count(*) FROM likes WHERE liked_album_id = albums.id) AS likes,
      (SELECT EXISTS (SELECT * FROM likes WHERE user_id = ? AND liked_album_id = ?)) AS liked
      FROM albums
      LEFT JOIN categories
      ON albums.category_id = categories.category_id
      WHERE albums.id = ?;`;
    const values = [authorization.id, album_id, album_id];
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
  }
};

module.exports = { allAlbums, albumDetail };
