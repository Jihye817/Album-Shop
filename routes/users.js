const express = require("express");
const router = express.Router();
const conn = require("../mariadb");

router.use(express.json());

//회원가입
router.post("/join", (req, res) => {
  const {email, name, password} = req.body;

  let sql = "INSERT INTO users (email, name, password) VALUES (?, ?, ?)";
  let values = [email, name, password];
  conn.query(sql, values, (err, results) => {
    if(err) {
      return res.status(400).end();
    }
    res.status(201).json(results);
  })
});

//로그인
router.post("/login", (req, res) => {});

//비밀번호 초기화 요청 / 초기화
router
  .route("/reset")
  .post((req, res) => {})
  .put((req, res) => {});

module.exports = router;
