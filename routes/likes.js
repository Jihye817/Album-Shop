const express = require("express");
const router = express.Router();
router.use(express.json());

router
  .route("/:id")
  .post((req, res) => {
    //좋아요 추가
  })
  .delete((req, res) => {
    //좋아요 삭제
  });

module.exports = router;
