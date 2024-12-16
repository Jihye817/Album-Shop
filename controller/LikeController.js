const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");

const addLike = (req, res) => {
  const liked_album_id = req.params.id;
  const { user_id } = req.body;

  let sql = "INSERT INTO likes (user_id, liked_album_id) VALUES (?, ?)";
  let values = [user_id, liked_album_id];
  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    return res.status(StatusCodes.CREATED).json(results);
  });
};

const deleteLike = (req, res) => {
  let sql = "DELETE FROM likes WHERE user_id = ? AND liked_album_id = ?";
  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
  });
};

module.exports = { addLike, deleteLike };
