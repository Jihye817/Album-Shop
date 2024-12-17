const express = require("express");
const router = express.Router();
const { validationResult, body, param } = require("express-validator");
const {
  addToCart,
  getCartItems,
  deleteCartItem,
} = require("../controller/CartController");
const { StatusCodes } = require("http-status-codes");

router.use(express.json());

const validate = (req, res, next) => {
  const err = validationResult(req);
  if (err.isEmpty()) {
    return next();
  } else {
    res.status(StatusCodes.BAD_REQUEST).json(err.array());
  }
};

router
  .route("/")
  .post(
    [
      body("album_id").isEmpty().withMessage("album_id 값을 확인해주세요"),
      body("quantity")
        .isEmpty()
        .isInt()
        .withMessage("quantity 값을 확인해주세요"),
      body("user_id").isEmpty().withMessage("user_id 값을 확인해주세요"),
      validate,
    ],
    addToCart
  )
  .get(
    [
      body("user_id").exists().isInt().withMessage("user_id 값을 확인해주세요"),
      validate,
    ],
    getCartItems
  );

router.delete(
  "/:id",
  [param("id").isEmpty().withMessage("id 값을 확인해주세요"), validate],
  deleteCartItem
);

module.exports = router;
