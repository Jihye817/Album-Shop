const express = require("express");
const {
  allAlbums,
  albumsByCategory,
  albumDetail,
} = require("../controller/AlbumController");
const router = express.Router();
router.use(express.json());

router.get("/", allAlbums);

router.get("/", albumsByCategory);

router.get("/:id", albumDetail);

module.exports = router;
