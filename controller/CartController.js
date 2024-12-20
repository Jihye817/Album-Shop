const { StatusCodes } = require("http-status-codes");
const conn = require("../mariadb");

const addToCart = (req, res) => {
  let { album_id, quantity, user_id } = req.body;

  let sql =
    "INSERT INTO cartItems (album_id, quantity, user_id) VALUES (?, ?, ?)";
  let values = [album_id, quantity, user_id];
  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    res.status(StatusCodes.CREATED).json(results);
  });
};

const getCartItems = (req, res) => {
  let { user_id, selected } = req.body;

  let sql = `SELECT cartItems.id, album_id, title, summary, quantity, price FROM cartItems
      LEFT JOIN albums ON cartItems.album_id = albums.id WHERE user_id = ?`;
  let values = [user_id];
  if (selected) {
    sql += ` AND cartItems.id IN (?)`;
    values.push(selected);
  }
  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    res.status(StatusCodes.OK).json(results);
  });
};

const deleteCartItem = (req, res) => {
  let { id } = req.params;

  let sql = "DELETE FROM cartItems WHERE id = ?";
  conn.query(sql, id, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    res.status(StatusCodes.OK).json(results);
  });
};

module.exports = { addToCart, getCartItems, deleteCartItem };
