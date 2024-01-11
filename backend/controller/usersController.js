const conn = require('../mariadb');
const {StatusCodes} = require('http-status-codes');
// JWT module
const jwt = require( 'jsonwebtoken');
const crypto = require('crypto'); // crypto 모듈 js기본 암호화 모듈
require("dotenv").config();

const join = (req, res) => {
  const {email, password} = req.body;
  // 회원가입 시 비밀번호 암호화, 암호화된 비밀번호와 salt 값 같이 저장
  const salt = crypto.randomBytes(64).toString('base64');
  const hashPassword = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('base64');

  const sql = `INSERT INTO users (email, password, salt) VALUES(?, ?, ?)`
  const values = [email, hashPassword, salt];
  
  conn.query(sql, values, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
      }
      res.status(StatusCodes.CREATED).json({
        message : `회원가입 완료.`
      });
    }
  );
}

const login = (req, res) => {
  const {email, password} = req.body;

  // 로그인 시 , 이메일&비밀번호 (날 것) => salt값 꺼내서 비밀번호 암호화 => 디비 비밀번호 비교

  const sql = `SELECT * FROM users WHERE email = ?`
  conn.query(sql, email,
    (err, results) => {
      if (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: "Internal Server Error"
        })
      }
      if (results.length === 0) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          message: "이메일이나 패스워드가 틀림요"
        })
      }
      // salt값 꺼내서 날 것으로 들어온 비밀번호를 암호화.
      const loginUser = results[0]

      const hashPassword = crypto.pbkdf2Sync(password, loginUser.salt, 10000, 64, 'sha512').toString('base64');

      if(loginUser && loginUser.password === hashPassword) {
        const token = jwt.sign({
          email: loginUser.email,
          password: loginUser.password
        }, process.env.PRIVITE_KEY, {
          expiresIn: "1h",
          issuer: "me"
        });

        res.cookie("token", token, {
          httpOnly: true
        });
        res.status(StatusCodes.OK).json({
          message: `${loginUser.email}님 로그인`,
          token: token
        })
      } else {
        res.status(StatusCodes.UNAUTHORIZED).json({
          message: `이메일 또는 패스워드가 틀렸습니다.`
        })
      }
    }
);
}

const passwordRequestReset = (req, res) => {
  const {email, password} = req.body;

  const salt = crypto.randomBytes(64).toString('base64');
  const hashPassword = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('base64');
  
  const sql = `UPDATE users SET password = ?, salt = ?  WHERE email = ?`;
  
  const value = [hashPassword, salt, email];

  conn.query(sql, value,
    (err, results) => {
      if (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: "Internal Server Error"
        });
      }
      if (results.affectedRows < 0) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "이메일 틀림"
        });
      }
      
        res.status(StatusCodes.OK).json({
          message: `${email}님 비밀번호 초기화 되었습니다`
        });
    });
}

// 비밀번호를 변경하려면 기존 email과 password를 확인 후 새로운 password를 입력받지않나?
const passwordChange = (req, res) => {
  const {email, password, newPassword} = req.body;

  // 현재 비밀번호 가져오기
  const getUserSql = `SELECT * FROM users WHERE email = ?`
  conn.query(getUserSql, [email], (err, results) => {
    if (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Internal Server Error',
      });
    }

    if (results.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: 'User not found',
      });
    }

    const user = results[0];
    const hashpassword = crypto.pbkdf2Sync(password, user.salt, 10000, 64, 'sha512').toString('base64');

    if(user.password !== hashpassword) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: 'Current password is incorrect',
      });
    }

    const newSalt = crypto.randomBytes(64).toString('base64');
    const newHashPassword = crypto.pbkdf2Sync(newPassword, newSalt, 10000, 64, 'sha512').toString('base64');

    const updatePasswordSql = `UPDATE users SET password = ?, salt = ? WHERE email = ?`
    const updatePasswordValues = [newHashPassword, newSalt, email];

    // update 
    conn.query(updatePasswordSql, updatePasswordValues, (err, results) => {
      if (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: 'Internal Server Error',
        });
      }

      const token = jwt.sign({
        email: user.email,
        password: newHashPassword
      },
      process.env.PRIVITE_KEY,
      {
        expiresIn: '1h',
        issuer: 'me'
      }
      );

      res.cookie('token', token, {
        httpOnly: true
      });
      return res.status(StatusCodes.OK).json({
        message: 'Password changed successfully',
        token: token,
      });
    });
  });
};

module.exports = {join, login, passwordRequestReset, passwordChange};