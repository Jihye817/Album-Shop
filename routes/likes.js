const express = require("express");
const { addLike, deleteLike } = require("../controller/LikeController");
const router = express.Router();
router.use(express.json());

router.route("/:id").post(addLike).delete(deleteLike);

module.exports = router;
