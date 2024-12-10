const express = require("express");
const router = express.Router();
router.use(express.json());

//회원가입
router.get("/join", (req, res) => {
  res.json("join");
});
router.post("/join", (req, res) => {});

//로그인
router.post("/login", (req, res) => {});

//비밀번호 초기화 요청 / 초기화
router
  .route("/reset")
  .post((req, res) => {})
  .put((req, res) => {});

module.exports = router;
