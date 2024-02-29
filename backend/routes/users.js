const express = require("express");
const router = express.Router();
const { validationRules, emailValidationsRules } = require('../middleware/usersMiddleware');
const { body } = require('express-validator');
const {join, login, emailRequest, resetPassword} = require('../controller/usersController');
const { verifyToken } = require("../middleware/ensureAuthorization");

// 회원 가입 ( 비밀번호 특수문자 하나,알파벳 소문자 하나, 알파벳 대문자 하나이상 )
router.post('/join',validationRules,  join);

// 로그인
router.post('/login', validationRules, login);

// 비밀번호 초기화
router.post('/reset', emailValidationsRules, emailRequest)
// 비밀번호 수정
router.put('/reset', [body('email').isEmail().withMessage("이메일로 해"), body('newPassword').isStrongPassword().withMessage('특수문자 하나,알파벳 소문자 하나, 알파벳 대문자 하나이상')], verifyToken, resetPassword);


module.exports = router;
