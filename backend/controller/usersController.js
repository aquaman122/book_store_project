const conn = require('../mariadb');
const {StatusCodes} = require('http-status-codes');
// JWT module
const jwt = require( 'jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto'); // crypto 모듈 js기본 암호화 모듈
require("dotenv").config();

const join = async (req, res) => {
  try {
    const {email, password} = req.body;
    // 회원가입 시 비밀번호 암호화, 암호화된 비밀번호와 salt 값 같이 저장
   // Hash the password using bcrypt
   const saltRounds = 10;
   const hashedPassword = await bcrypt.hash(password, saltRounds);

    const sql = `INSERT INTO users (email, password) VALUES(?, ?)`
    const values = [email, hashedPassword];

    const results = await queryAsync(sql, values);
    if (results.affectedRows > 0) {
      res.status(StatusCodes.CREATED).json({
        message: '회원가입 완료'
      })
    } else {
      res.status(StatusCodes.NOT_FOUND).end();
    }
  } catch (err) {
    console.log(err);
    return res.status(StatusCodes.BAD_REQUEST).end();
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const sql = `SELECT * FROM users WHERE email = ?`;
    const results = await queryAsync(sql, email);

    if (results.length === 0) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: '이메일이나 패스워드가 틀림요',
      });
    }

    const loginUser = results[0];
    const passwordMatch = await bcrypt.compare(password, loginUser.password);

    if (passwordMatch) {
      const token = jwt.sign(
        {
          email: loginUser.emailpasswordMatch
        },
        process.env.PRIVITE_KEY,
        {
          expiresIn: '1h',
          issuer: 'me',
        }
      );

      res.cookie('token', token, {
        httpOnly: true,
      });
      res.status(StatusCodes.OK).json({
        message: `${loginUser.email}님 로그인`,
        token: token,
      });
    } else {
      res.status(StatusCodes.UNAUTHORIZED).json({
        message: `이메일 또는 패스워드가 틀렸습니다.`,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Internal Server Error',
    });
  }
};


const passwordRequestReset = async (req, res) => {
  try {
    const {email, password} = req.body;

    const salt = crypto.randomBytes(64).toString('base64');
    const hashPassword = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('base64');
    
    const sql = `UPDATE users SET password = ?, salt = ?  WHERE email = ?`;
    
    const values = [hashPassword, salt, email];
    const results = await queryAsync(sql, values);

    if (results.affectedRows < 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "이메일 틀림"
      });
    }
    res.status(StatusCodes.OK).json({
      message: `${email}님 비밀번호 초기화 되었습니다`
    });
  } catch (err) {
    console.log(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Internal Server Error"
    });
  }
}

// 비밀번호를 변경하려면 기존 email과 password를 확인 후 새로운 password를 입력받지않나?
const passwordChange = async (req, res) => {
  try {
    const { email, password, newPassword } = req.body;
    const getUserSql = `SELECT * FROM users WHERE email = ?`;

    const results = await queryAsync(getUserSql, [email]);

    if (results.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: 'User not found',
      });
    }

    const user = results[0];
    const hashpassword = crypto.pbkdf2Sync(password, user.salt, 10000, 64, 'sha512').toString('base64');

    if (user.password !== hashpassword) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: 'Current password is incorrect',
      });
    }

    const newSalt = crypto.randomBytes(64).toString('base64');
    const newHashPassword = crypto.pbkdf2Sync(newPassword, newSalt, 10000, 64, 'sha512').toString('base64');

    const updatePasswordSql = `UPDATE users SET password = ?, salt = ? WHERE email = ?`;
    const updatePasswordValues = [newHashPassword, newSalt, email];

    await queryAsync(updatePasswordSql, updatePasswordValues);

    const token = jwt.sign(
      {
        email: user.email,
        password: newHashPassword,
      },
      process.env.PRIVITE_KEY,
      {
        expiresIn: '1h',
        issuer: 'me',
      }
    );

    res.cookie('token', token, {
      httpOnly: true,
    });
    res.status(StatusCodes.OK).json({
      message: 'Password changed successfully',
      token: token,
    });
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Internal Server Error',
    });
  }
};

// Helper function fro executing queries with promises
const queryAsync = (sql, values) => {
  return new Promise((resolve, reject) => {
    conn.query(sql, values, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

module.exports = {join, login, passwordRequestReset, passwordChange};