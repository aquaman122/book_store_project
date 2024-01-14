const express = require("express");
const router = express.Router();
const { validationRules, emailValidationsRules } = require('../middleware/usersMiddleware');
const { body } = require('express-validator');
const {join, login, passwordRequestReset, passwordChange} = require('../controller/usersController');

// 회원 가입 ( 비밀번호 특수문자 하나,알파벳 소문자 하나, 알파벳 대문자 하나이상 )
router.post('/join',validationRules,  join);

// 로그인
router.post('/login', validationRules, login);

// 비밀번호 초기화
router.post('/reset', emailValidationsRules, passwordRequestReset)
// 비밀번호 수정
router.put('/reset', [...validationRules, body('newPassword').isStrongPassword().withMessage('특수문자 하나,알파벳 소문자 하나, 알파벳 대문자 하나이상')], passwordChange);


module.exports = router;