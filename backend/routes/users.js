const express = require("express");
const router = express.Router();
// validator
const {body, validationResult} = require('express-validator');
// connection mariadb module
const conn = require('../mariadb');

const {StatusCodes} = require('http-status-codes');

const {join, login, resetInit, reset} = require('../controller/usersController');



// dotenv module and declear
require("dotenv").config();

router.use(express.json());

const isValidate = (req, res, next) => {
  const err = validationResult(req);

  if (err.isEmpty()) {
    return next();
  }
  res.status(StatusCodes.BAD_REQUEST).json(err.array());
}

const isError = (res) => {
  return res.status(StatusCodes.NOT_FOUND).json({
    message: "오류임.."
  });
}

// 회원 가입
router.post(
  '/join',
  [
    body('email').isEmail().withMessage("뭔가이상하"),
    body('password').isStrongPassword().withMessage("특수문자 하나,알파벳 소문자 하나, 알파벳 대문자 하나이상"),
    isValidate
  ], join);

// 로그인
router.post(
  '/login',
  [
    body('email').isEmail().withMessage("뭔가이상하"),
    body('password').isStrongPassword().withMessage("특수문자 하나,알파벳 소문자 하나, 알파벳 대문자 하나이상"),
    isValidate
  ], login);

// 비밀번호 초기화
router.post('/reset',
  [body("email").isEmail().withMessage("이메일"),
   isValidate
  ], resetInit)
// 비밀번호 수정
router.put(
  '/reset',
  [
    body('email').isEmail().withMessage("뭔가이상하"),
    body('password'),
    body('newPassword').isStrongPassword().withMessage("특수문자 하나,알파벳 소문자 하나, 알파벳 대문자 하나이상"),
    isValidate
  ], reset)


module.exports = router;