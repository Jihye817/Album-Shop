const express = require("express");
const { addLike, deleteLike } = require("../controller/LikeController");
const { validationResult, param, body } = require("express-validator");
const { StatusCodes } = require("http-status-codes");
const router = express.Router();
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
  .route("/:id")
  .post(
    [
      param("id").notEmpty().isInt().withMessage("id값을 확인해주세요."),
      body("user_id").notEmpty().withMessage("user_id 값이 잘못되었습니다."),
      validate,
    ],
    addLike
  )
  .delete(
    [
      param("id").notEmpty().isInt().withMessage("id값을 확인해주세요."),
      body("user_id").notEmpty().withMessage("user_id 값이 잘못되었습니다."),
      validate,
    ],
    deleteLike
  );

module.exports = router;