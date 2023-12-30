const express = require("express");
const router = express.Router();
// connection mariadb module
const conn = require('../mariadb');

// JWT module
const jwt = require('jsonwebtoken');

// dotenv module and declear
const dotEnv = require("dotenv");
dotEnv.config();

router.use(express.json());

const isValidate = (req, res, next) => {
  const err = validationResult(req);

  if (err.isEmpty()) {
    return next();
  }
  res.status(400).json(err.array());
};

const isError = (res) => {
  return res.status(404).json({
    message: "오류임.."
  });
};

// 전체 도서조회

// 개별 도서조회

// category별 도서 목록 조회


module.exports = router;