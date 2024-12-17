const express = require("express");
const { addToCart, getCartItems, deleteCartItem } = require("../controller/CartController");
const router = express.Router();
router.use(express.json());

router
  .route("/")
  .post(addToCart)
  .get(getCartItems);

//장바구니 도서 삭제
router.delete("/:id", deleteCartItem);

//장바구니에서 선택한 주문 예상 상품 목록 조회
router.get("/", (req, res) => {});

module.exports = router;
