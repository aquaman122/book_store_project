const express = require("express");
const router = express.Router();
// connection mariadb module

const {
  getBooks,
  bookDetail
} = require('../controller/bookController');

router.use(express.json());

// 전체 도서조회
router.get('/', getBooks);
// 개별 도서조회
router.get('/:id', bookDetail);
// category별 도서 목록 조회


module.exports = router;