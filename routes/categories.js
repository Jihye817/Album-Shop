const express = require("express");
const { allCategories } = require("../controller/CategoryController");
const router = express.Router();

router.use(express.json());

router.get("/", allCategories);

module.exports = router;