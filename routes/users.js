const express = require("express");
const router = express.Router();
const conn = require("../mariadb");
const { validationResult, body } = require("express-validator");

router.use(express.json());

const validate = (req, res, next) => {
  const err = validationResult(req);
  if (err.isEmpty()) {
    return next();
  } else {
    return res.status(400).json(err.array());
  }
};

//회원가입
router.post(
  "/join",
  [
    body("email").notEmpty().isEmail().withMessage("이메일을 확인해주세요"),
    body("name").notEmpty().isString().withMessage("이름을 확인해주세요"),
    body("password")
      .notEmpty()
      .isString()
      .withMessage("비밀번호를 확인해주세요"),
    validate,
  ],
  (req, res) => {
    const { email, name, password } = req.body;

    let sql = "INSERT INTO users (email, name, password) VALUES (?, ?, ?)";
    let values = [email, name, password];
    conn.query(sql, values, (err, results) => {
      if (err) {
        return res.status(400).end();
      }
      res.status(201).json(results);
    });
  }
);

//로그인
router.post("/login", (req, res) => {});

//비밀번호 초기화 요청 / 초기화
router
  .route("/reset")
  .post((req, res) => {})
  .put((req, res) => {});

module.exports = router;
