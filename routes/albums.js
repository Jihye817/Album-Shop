const express = require("express");
const router = express.Router();
router.use(express.json());

router.get("/", (req, res) => {
  //전체 앨범 조회
  //categoryId 있을 경우 -> 카테고리별 도서 목록 조회
});

//개별 앨범 조회
router.get("/:id", (req, res) => {});

module.exports = router;
