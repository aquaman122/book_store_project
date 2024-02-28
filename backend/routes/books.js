const express = require("express");
const router = express.Router();

const { getAllBooks, getIndividualBook } = require("../controller/bookController");

router.get("/", getAllBooks); //전체조회 & 카테고리별 조회
router.get("/:id", getIndividualBook);

module.exports = router;
