const express = require("express");
const router = express.Router();
// connection mariadb module
const conn = require('../mariadb');

// JWT module
const jwt = require('jsonwebtoken');

// dotenv module and declear
require("dotenv").config;

const {
  allBooks,
  bookDetail
} = require('../controller/bookController');

router.use(express.json());

// 전체 도서조회
router.get('/', allBooks);
// 개별 도서조회
router.get('/:id', bookDetail);
// category별 도서 목록 조회


module.exports = router;