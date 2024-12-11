const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

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

const login = (req, res) => {
  const { email, password } = req.body;

  let sql = "SELECT * FROM users WHERE email = ?";
  conn.query(sql, email, (err, results) => {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    const loginUser = results[0];
    if (loginUser && loginUser.password == password) {
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

const passwordResetRequest = (req, res) => {};

const passwordReset = (req, res) => {};

module.exports = { join, login, passwordResetRequest, passwordReset };
