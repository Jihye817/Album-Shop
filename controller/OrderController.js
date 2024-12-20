// const conn = require("../mariadb");
const mariadb = require("mysql2/promise");
const { StatusCodes } = require("http-status-codes");
const dotenv = require("dotenv");
dotenv.config();

const order = async (req, res) => {
  const {
    items,
    delivery,
    totalQuantity,
    totalPrice,
    userId,
    firstAlbumTitle,
  } = req.body;
  let deliveryId;
  let orderId;
  const conn = await mariadb.createConnection({
    host: process.env.DB_LOCALHOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: "AlbumShop",
    dateStrings: true,
  });

  let sql = `INSERT INTO deliveries (address, receiver, contact)
    VALUES (?, ?, ?)`;
  let values = [delivery.address, delivery.receiver, delivery.contact];
  let [results] = await conn.execute(sql, values);

  deliveryId = results.insertId;

  sql = `INSERT INTO orders (album_title, total_quantity, total_price, user_id, delivery_id)
    VALUES (?, ?, ?, ?, ?)`;
  values = [firstAlbumTitle, totalQuantity, totalPrice, userId, deliveryId];
  [results] = await conn.execute(sql, values);
  console.log(results);

  orderId = results.insertId;

  sql = `INSERT INTO orderedAlbums (order_id, album_id, quantity) VALUES ?;`;
  values = [];
  items.forEach((item) => {
    values.push([orderId, item.album_id, item.quantity]);
  });
  [results] = await conn.query(sql, [values]);

  console.log(results);
  return res.status(StatusCodes.OK).json(results);
};

const getOrders = (req, res) => {
  res.json("주문 목록 조회");
};

const getOrderDetail = (req, res) => {
  res.json("주문 상세 조회");
};

module.exports = { order, getOrders, getOrderDetail };
