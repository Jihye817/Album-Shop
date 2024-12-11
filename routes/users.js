const express = require("express");
const router = express.Router();
const { validationResult, body } = require("express-validator");
const {
  join,
  login,
  passwordResetRequest,
  passwordReset,
} = require("../controller/UserController");

router.use(express.json());

const validate = (req, res, next) => {
  const err = validationResult(req);
  if (err.isEmpty()) {
    return next();
  } else {
    return res.status(400).json(err.array());
  }
};

router.post(
  "/join",
  [
    body("email").notEmpty().isEmail().withMessage("이메일을 확인해주세요"),
    body("name").notEmpty().isString().withMessage("이름을 확인해주세요"),
    body("password")
      .notEmpty()
      .isString()
      .withMessage("비밀번호를 확인해주세요"),
    validate,
  ],
  join
);

router.post(
  "/login",
  [
    body("email").notEmpty().isEmail().withMessage("이메일을 확인해주세요"),
    body("password")
      .notEmpty()
      .isString()
      .withMessage("비밀번호를 확인해주세요"),
    validate,
  ],
  login
);

//비밀번호 초기화 요청 / 초기화
router
  .route("/reset")
  .post(
    [
      body("email").notEmpty().isEmail().withMessage("이메일을 확인해주세요"),
      validate,
    ],
    passwordResetRequest
  )
  .put(
    [
      body("email").notEmpty().isEmail().withMessage("이메일을 확인해주세요"),
      body("password")
        .notEmpty()
        .isString()
        .withMessage("비밀번호를 확인해주세요"),
      validate,
    ],
    passwordReset
  );

module.exports = router;
