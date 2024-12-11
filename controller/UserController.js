const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");

const join = (req, res) => {
  const { email, name, password } = req.body;

  let sql = "INSERT INTO users (email, name, password) VALUES (?, ?, ?)";
  let values = [email, name, password];
  conn.query(sql, values, (err, results) => {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    res.status(StatusCodes.CREATED).json(results);
  });
};

const login = (req, res) => {};

const passwordResetRequest = (req, res) => {};

const passwordReset = (req, res) => {};

module.exports = { join, login, passwordResetRequest, passwordReset };
