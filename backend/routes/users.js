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
}

// 회원 가입
router.post(
  '/signup', (req, res) => {
    res.send("hi");
})

router.get('/users', (req, res) => {
  const sql = "SELECT * FROM users"
  conn.query(sql, function(err, results) {
      res.status(201).json(results);
    }
  );
})
// 로그인

// 비밀번호 초기화

// 비밀번호 수정


module.exports = router;