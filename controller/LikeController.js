const jwt = require("jsonwebtoken");
const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");
const ensureAuthorization = require("../auth");

const addLike = (req, res) => {
  const likedAlbumId = req.params.id;
  const authorization = ensureAuthorization(req);

  if (authorization instanceof jwt.TokenExpiredError) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "로그인 세션이 만료되었습니다." });
  } else if (authorization instanceof jwt.JsonWebTokenError) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "유효하지 않은 토큰입니다." });
  } else {
    let sql = "INSERT INTO likes (user_id, liked_album_id) VALUES (?, ?)";
    let values = [authorization.id, likedAlbumId];
    conn.query(sql, values, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
      }

      return res.status(StatusCodes.CREATED).json(results);
    });
  }
};

const deleteLike = (req, res) => {
  const likedAlbumId = req.params.id;
  const authorization = ensureAuthorization(req);

  if (authorization instanceof jwt.TokenExpiredError) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "로그인 세션이 만료되었습니다." });
  } else if (authorization instanceof jwt.JsonWebTokenError) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "유효하지 않은 토큰입니다." });
  } else {
    let sql = "DELETE FROM likes WHERE user_id = ? AND liked_album_id = ?";
    let values = [authorization.id, likedAlbumId];
    conn.query(sql, values, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
      }
      if (results.affectedRows !== 0) {
        res.status(StatusCodes.OK).end();
      } else {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "해당하는 데이터가 없습니다." });
      }
    });
  }
};

module.exports = { addLike, deleteLike };
