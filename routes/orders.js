const express = require("express");
const router = express.Router();
router.use(express.json());

router
  .route("/")
  .post((req, res) => {
    //주문하기
  })
  .get((req, res) => {
    //주문 목록 조회
  });

//주문 상세 상품 조회
router.get("/:id", (req, res) => {});

module.exports = router;
