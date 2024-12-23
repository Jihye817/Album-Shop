const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const conn = require("../mariadb");

const addToCart = (req, res) => {
  let { album_id, quantity } = req.body;
  const authorization = ensureAuthorization(req);
  let sql =
    "INSERT INTO cartItems (album_id, quantity, user_id) VALUES (?, ?, ?)";
  let values = [album_id, quantity, authorization.id];
  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    res.status(StatusCodes.CREATED).json(results);
  });
};

const getCartItems = (req, res) => {
  let { selected } = req.body;
  const authorization = ensureAuthorization(req);

  let sql = `SELECT cartItems.id, album_id, title, summary, quantity, price FROM cartItems
      LEFT JOIN albums ON cartItems.album_id = albums.id WHERE user_id = ?`;
  let values = [authorization.id];
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
  let cartItemId = req.params.id;

  let sql = "DELETE FROM cartItems WHERE id = ?";
  conn.query(sql, cartItemId, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    res.status(StatusCodes.OK).json(results);
  });
};

function ensureAuthorization(req) {
  let receivedJwt = req.headers["authorization"];
  let decodedJwt = jwt.verify(receivedJwt, process.env.PRIVATE_KEY);

  return decodedJwt;
}

module.exports = { addToCart, getCartItems, deleteCartItem };
