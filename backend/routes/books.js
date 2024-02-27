const express = require("express");
const router = express.Router();

const { getAllBooks, getIndividualBook } = require("../controller/bookController");

router.get("/", getAllBooks); //전체조회 & 카테고리별 조회
router.get("/:id", getIndividualBook);

module.exports = router;

// const express = require("express");
// const router = express.Router();
// // connection mariadb module

// const {
//   getBooks,
//   bookDetail
// } = require('../controller/bookController');

// router.use(express.json());

// // 전체 도서조회
// router.get('/', getBooks);
// // 개별 도서조회
// router.get('/:id', bookDetail);
// // category별 도서 목록 조회


// module.exports = router;
