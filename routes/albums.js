const express = require("express");
const router = express.Router();
const { StatusCodes } = require("http-status-codes");
const { validationResult, param } = require("express-validator");
const {
  allAlbums,
  albumDetail,
} = require("../controller/AlbumController");

router.use(express.json());

const validate = (req, res, next) => {
  const err = validationResult(req);
  if (err.isEmpty()) {
    return next();
  } else {
    res.status(StatusCodes.BAD_REQUEST).json(err.array());
  }
};

router.get("/", allAlbums);

router.get(
  "/:id",
  [
    param("id").notEmpty().isInt().withMessage("id값을 확인해주세요."),
    validate,
  ],
  albumDetail
);

module.exports = router;
