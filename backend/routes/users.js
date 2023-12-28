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

const isError = (res) => {
  return res.status(404).json({
    message: "오류임.."
  });
}

// 회원 가입
router.post(
  '/signup',
  [
    body('email').isEmail().withMessage("뭔가이상하"),
    body('password').isStrongPassword().withMessage("특수문자 하나,알파벳 소문자 하나, 알파벳 대문자 하나이상"),
    body('name').notEmpty(),
    isValidate
  ],
  (req, res) => {
  const {email, name, password} = req.body;
  const sql = `INSERT INTO users VALUES(?, ?, ?)`
  const values = [email, name, password];
  conn.query(sql, values,
    function(err, results) {
      res.status(201).json({
        message : `${name}님 하이요`
      });
    }
  );
});
// 로그인
router.post(
  '/login',
  [
    body('email').isEmail().withMessage("뭔가이상하"),
    body('password').isStrongPassword().withMessage("특수문자 하나,알파벳 소문자 하나, 알파벳 대문자 하나이상"),
    isValidate
  ],
  (req, res) => {
    const {email, password} = req.body;
    const sql = `SELECT * FROM users WHERE email = ?`
    conn.query(sql, email,
      (err, results) => {
        if (err) {
          return res.status(500).json({
            message: "Internal Server Error"
          })
        }
        if (results.length === 0) {
          return res.status(401).json({
            message: "이메일이나 패스워드가 틀림요"
          })
        }
        const user = results[0]
        if(user.password === password) {
          const token = jwt.sign({
            email: user.email,
            password: user.password
          }, process.env.PRIVITE_KEY, {
            expiresIn: "1h",
            issuer: "me"
          })
          return res.status(200).json({
            message: `${user.name}님 하이요`,
            token: token
          })
        } else {
          return res.status(401).json({
            message: `이메일이나 패스워드가 틀림요`
          })
        }
      }
  );
})
// 비밀번호 초기화
router.post('/password_reset',
  [body("email").isEmail().withMessage("이메일"),
   isValidate
  ],
  (req, res) => {
    const {email} = req.body;
    const sql = `UPDATE users SET password = '' WHERE email = ?`;

    conn.query(sql, email,
      (err, results) => {
        if (err) {
          return res.status(500).json({
            message: "Internal Server Error"
          });
        }
        if (results.affectedRows < 0) {
          return res.status(404).json({
            message: "이메일 틀림"
          });
        }
        
          res.status(200).json({
            message: `${email}님 비밀번호 초기화 되었습니다`
          });
      });
  }
)
// 비밀번호 수정
router.put(
  '/password_update',
  [
    body('email').isEmail().withMessage("뭔가이상하"),
    body('password').isStrongPassword().withMessage("특수문자 하나,알파벳 소문자 하나, 알파벳 대문자 하나이상"),
    body('newPassword').isStrongPassword().withMessage("특수문자 하나,알파벳 소문자 하나, 알파벳 대문자 하나이상"),
    isValidate
  ],
  (req, res) => {
    const {email, password, newPassword} = req.body;
    const sql = `UPDATE users SET password = ? WHERE (email, password) = (?, ?)`
    const values = [newPassword, email, password]
    conn.query(sql, values,
      (err, results) => {
        if (err) {
          return res.status(500).json({
            message: "Internal Server Error"
          })
        }
        if (results.affectedRows < 0) {
          return res.status(401).json({
            message: "이메일이나 패스워드가 틀림요"
          })
        }

        const token = jwt.sign({
          email: email,
          password: newPassword
        }, process.env.PRIVITE_KEY, {
          expiresIn: "1h",
          issuer: "me"
        })
        return res.status(200).json({
          message: `비밀번호 변경 완료`,
          token: token
        })
      }
  );
})


module.exports = router;