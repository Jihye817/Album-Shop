const { StatusCodes } = require("http-status-codes");
const conn = require("../mariadb");

const allCategories = (req, res) => {
  const sql = "SELECT * FROM categories";
  conn.query(sql, (err, results) => {
    if (err) {
      console.log(err);
      res.status(StatusCodes.BAD_REQUEST).end();
    }
    res.status(StatusCodes.OK).json(results);
  });
};

module.exports = { allCategories };
