const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const crypto = require("crypto");

dotenv.config();

const join = (req, res) => {
  const { email, name, password } = req.body;

  const salt = crypto.randomBytes(10).toString("base64");
  const hashPassword = crypto
    .pbkdf2Sync(password, salt, 10000, 10, "sha512")
    .toString("base64");

  let sql =
    "INSERT INTO users (email, name, password, salt) VALUES (?, ?, ?, ?)";
  let values = [email, name, hashPassword, salt];
  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    res.status(StatusCodes.CREATED).json(results);
  });
};

const login = (req, res) => {
  const { email, password } = req.body;

  let sql = "SELECT * FROM users WHERE email = ?";
  conn.query(sql, email, (err, results) => {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    const loginUser = results[0];

    const hashPassword = crypto
      .pbkdf2Sync(password, loginUser.salt, 10000, 10, "sha512")
      .toString("base64");

    if (loginUser && loginUser.password == hashPassword) {
      const token = jwt.sign(
        { email: loginUser.email, name: loginUser.name },
        process.env.PRIVATE_KEY,
        {
          expiresIn: "30m",
          issuer: "jihye",
        }
      );
      res.cookie("token", token, { httpOnly: true });

      res.status(StatusCodes.OK).json({
        message: `${loginUser.name}님 로그인되었습니다`,
        token: token,
      });
    } else {
      res.status(StatusCodes.UNAUTHORIZED).json({
        message: "이메일 또는 비밀번호가 일치하지 않습니다.",
      });
    }
  });
};

const passwordResetRequest = (req, res) => {
  const { email } = req.body;

  let sql = "SELECT * FROM users WHERE email = ?";
  conn.query(sql, email, (err, results) => {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    const user = results[0];
    if (user) {
      res.status(StatusCodes.OK).json({
        email: email,
      });
    } else {
      res.status(StatusCodes.UNAUTHORIZED).end();
    }
  });
};

const passwordReset = (req, res) => {
  const { email, password } = req.body;

  const salt = crypto.randomBytes(10).toString("base64");
  const hashPassword = crypto
    .pbkdf2Sync(password, salt, 10000, 10, "sha512")
    .toString("base64");

  let sql = "UPDATE users SET password = ?, salt = ? WHERE email = ?";
  const values = [hashPassword, salt, email];
  conn.query(sql, values, (err, results) => {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    if (results.affectedRows !== 0) {
      res.status(StatusCodes.OK).json({
        message: "비밀번호가 변경되었습니다.",
      });
    } else {
      res.status(StatusCodes.BAD_REQUEST).end();
    }
  });
};

module.exports = { join, login, passwordResetRequest, passwordReset };
