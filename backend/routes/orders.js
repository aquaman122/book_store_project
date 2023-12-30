const express = require("express");
const router = express.Router();
// validator
const {body, validationResult} = require('express-validator');
// connection mariadb module
const conn = require('../mariadb');

// JWT module
const jwt = require('jsonwebtoken');

// dotenv module and declear
require("dotenv").config();

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

// 장바구니 담기 POST 201

// 장바구니 조회 200

// 장바구니 제거 200

// 장바구니 일괄 삭제 200

module.exports = router;