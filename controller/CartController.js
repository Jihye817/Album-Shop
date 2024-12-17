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
  res.json("장바구니 아이템 목록 조회");
};


const deleteCartItem = (req, res) => {
  res.json("장바구니 아이템 삭제");
};



module.exports = {addToCart, getCartItems, deleteCartItem}