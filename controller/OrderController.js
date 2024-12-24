const mariadb = require("mysql2/promise");
const { StatusCodes } = require("http-status-codes");
const ensureAuthorization = require("../auth");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const order = async (req, res) => {
  let deliveryId;
  let orderId;
  const conn = await mariadb.createConnection({
    host: process.env.DB_LOCALHOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: "AlbumShop",
    dateStrings: true,
  });
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
    const { items, delivery, totalQuantity, totalPrice, firstAlbumTitle } =
      req.body;
    let sql = `INSERT INTO deliveries (address, receiver, contact)
    VALUES (?, ?, ?)`;
    let values = [delivery.address, delivery.receiver, delivery.contact];
    let [results] = await conn.execute(sql, values);

    deliveryId = results.insertId;

    sql = `INSERT INTO orders (album_title, total_quantity, total_price, user_id, delivery_id)
    VALUES (?, ?, ?, ?, ?)`;
    values = [
      firstAlbumTitle,
      totalQuantity,
      totalPrice,
      authorization.id,
      deliveryId,
    ];
    [results] = await conn.execute(sql, values);

    orderId = results.insertId;

    sql = `SELECT album_id, quantity FROM cartItems WHERE id IN (?)`;
    let [orderItems, fields] = await conn.query(sql, [items]);
    
    sql = `INSERT INTO orderedAlbums (order_id, album_id, quantity) VALUES ?`;
    values = [];
    orderItems.forEach((item) => {
      values.push([orderId, item.album_id, item.quantity]);
    });
    [results] = await conn.query(sql, [values]);

    let result = await deleteCartItems(conn, items);

    return res.status(StatusCodes.OK).json(result);
  }
};

const deleteCartItems = async (conn, items) => {
  let sql = `DELETE FROM cartItems WHERE id IN (?)`;
  let result = await conn.query(sql, [items]);
  return result;
};

const getOrders = async (req, res) => {
  const conn = await mariadb.createConnection({
    host: process.env.DB_LOCALHOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: "AlbumShop",
    dateStrings: true,
  });

  let sql = `SELECT orders.id, created_at, address, receiver, contact, album_title, total_quantity, total_price
    FROM orders LEFT JOIN deliveries 
    ON orders.delivery_id = deliveries.id`;
  let [rows, fields] = await conn.query(sql);

  res.status(StatusCodes.OK).json(rows);
};

const getOrderDetail = async (req, res) => {
  const conn = await mariadb.createConnection({
    host: process.env.DB_LOCALHOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: "AlbumShop",
    dateStrings: true,
  });
  const orderId = req.params.id;

  let sql = `SELECT album_id, title, artist, price, quantity 
    FROM orderedAlbums LEFT JOIN albums 
    ON orderedAlbums.album_id = albums.id 
    WHERE order_id = ?`;
  let [rows, fields] = await conn.query(sql, orderId);

  res.status(StatusCodes.OK).json(rows);
};

module.exports = { order, getOrders, getOrderDetail };
