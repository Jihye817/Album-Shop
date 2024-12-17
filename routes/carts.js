const express = require("express");
const { addToCart, getCartItems, deleteCartItem, selectedCartItem } = require("../controller/CartController");
const router = express.Router();
router.use(express.json());

router
  .route("/")
  .post(addToCart)
  .get(getCartItems);

router.delete("/:id", deleteCartItem);

module.exports = router;
