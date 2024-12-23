const jwt = require("jsonwebtoken");
const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");
const dotenv = require("dotenv");
dotenv.config();

const addLike = (req, res) => {
  const likedAlbumId = req.params.id;
  const authorization = ensureAuthorization(req);

  let sql = "INSERT INTO likes (user_id, liked_album_id) VALUES (?, ?)";
  let values = [authorization.id, likedAlbumId];
  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    return res.status(StatusCodes.CREATED).json(results);
  });
};

const deleteLike = (req, res) => {
  const likedAlbumId = req.params.id;
  const authorization = ensureAuthorization(req);

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
};

function ensureAuthorization(req) {
  let receivedJwt = req.headers["authorization"];
  let decodedJwt = jwt.verify(receivedJwt, process.env.PRIVATE_KEY);

  return decodedJwt;
}

module.exports = { addLike, deleteLike };
