const pool = require('../mariadb');
const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto'); // crypto 모듈 js기본 암호화 모듈
require('dotenv').config();

const join = async (req, res) => {
  try {
    const { email, password } = req.body;
    // 회원가입 시 비밀번호 암호화, 암호화된 비밀번호와 salt 값 같이 저장
    // Hash the password using bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const sql = `INSERT INTO users (email, password) VALUES (?, ?)`;
    const values = [email, hashedPassword];

    const results = await pool.query(sql, values);
    if (results && results.affectedRows > 0) {
      res.status(StatusCodes.CREATED).json({
        message: '회원가입 완료'
      });
    } else {
      res.status(StatusCodes.NOT_FOUND).end();
    }
  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.BAD_REQUEST).end();
  }
}


const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const sql = `SELECT * FROM users WHERE email = ?`;
    const results = await pool.execute(sql, [email]); // Changed from pool.query to pool.execute

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
          id: loginUser.id,
          email: loginUser.email
        },
        process.env.PRIVATE_KEY,
        {
          expiresIn: '3m',
          issuer: 'me',
        }
      );

      res.cookie('token', token, {
        httpOnly: true,
      });
      res.status(StatusCodes.OK).json({
        ...results[0],
        message: `${loginUser.email}님 로그인`,
        token: token,
      });
    } else {
      res.status(StatusCodes.UNAUTHORIZED).json({
        message: `이메일 또는 패스워드가 틀렸습니다.`,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(StatusCodes.UNAUTHORIZED).json({
      message: 'Internal Server Error',
    });
  }
};

const emailRequest = async (req, res) => {
  try {
    const { email } = req.body;
    
    const sql = `SELECT * FROM users WHERE email = ?`;
    const [results] = await pool.query(sql, [email]); // Changed from pool.query to pool.execute

    // 해당 이메일 주소로 사용자를 찾지 못한 경우
    if (!results || results.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "이메일 주소를 확인해주세요."
      });
    }
    return res.status(StatusCodes.OK).json({
      message: "이메일 확인완료."
    })
  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "비밀번호 재설정 중에 오류가 발생했습니다."
    });
  }
}

const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    // 이메일 주소를 기반으로 사용자를 데이터베이스에서 가져옵니다.
    const getUserSql = `SELECT * FROM users WHERE email = ?`;
    const [results] = await pool.query(getUserSql, [email]);

    // 사용자가 존재하지 않는 경우
    if (results.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: '사용자를 찾을 수 없습니다.',
      });
    }

    // 사용자가 존재하는 경우
    const user = results[0];

    // 새로운 비밀번호를 해싱합니다.
    const newHashPassword = await bcrypt.hash(newPassword, 10);

    // 새로운 비밀번호와 함께 사용자 정보를 업데이트합니다.
    const updatePasswordSql = `UPDATE users SET password = ? WHERE email = ?`;
    await pool.query(updatePasswordSql, [newHashPassword, email]);

    // 새로운 토큰을 생성하여 클라이언트에게 응답합니다.
    const token = jwt.sign(
      {
        email: email,
        password: newHashPassword,
      },
      process.env.PRIVATE_KEY,
      {
        expiresIn: '3m',
        issuer: 'me',
      }
    );

    res.cookie('token', token, {
      httpOnly: true,
    });
    res.status(StatusCodes.OK).json({
      message: '비밀번호가 성공적으로 변경되었습니다.',
      token: token,
    });
  } catch (err) {
    console.error(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: '내부 서버 오류',
    });
  }
};



module.exports = { join, login, emailRequest, resetPassword };



// const conn = require('../mariadb');
// const {StatusCodes} = require('http-status-codes');
// // JWT module
// const jwt = require( 'jsonwebtoken');
// const bcrypt = require('bcrypt');
// const crypto = require('crypto'); // crypto 모듈 js기본 암호화 모듈
// require('dotenv').config();

// const join = async (req, res) => {
//   try {
//     const {email, password} = req.body;
//     // 회원가입 시 비밀번호 암호화, 암호화된 비밀번호와 salt 값 같이 저장
//    // Hash the password using bcrypt
//    const saltRounds = 10;
//    const hashedPassword = await bcrypt.hash(password, saltRounds);

//     const sql = `INSERT INTO users (email, password) VALUES(?, ?)`
//     const values = [email, hashedPassword];

//     const results = await queryAsync(sql, values);
//     if (results.affectedRows > 0) {
//       res.status(StatusCodes.CREATED).json({
//         message: '회원가입 완료'
//       })
//     } else {
//       res.status(StatusCodes.NOT_FOUND).end();
//     }
//   } catch (err) {
//     console.log(err);
//     return res.status(StatusCodes.BAD_REQUEST).end();
//   }
// }

// const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const sql = `SELECT * FROM users WHERE email = ?`;
//     const results = await queryAsync(sql, email);

//     if (results.length === 0) {
//       return res.status(StatusCodes.UNAUTHORIZED).json({
//         message: '이메일이나 패스워드가 틀림요',
//       });
//     }

//     const loginUser = results[0];
//     const passwordMatch = await bcrypt.compare(password, loginUser.password);

//     if (passwordMatch) {
//       const token = jwt.sign(
//         {
//           id: loginUser.id,
//           email: loginUser.email
//         },
//         process.env.PRIVATE_KEY,
//         {
//           expiresIn: '3m',
//           issuer: 'me',
//         }
//       );

//       res.cookie('token', token, {
//         httpOnly: true,
//       });
//       res.status(StatusCodes.OK).json({
//         message: `${loginUser.email}님 로그인`,
//         token: token,
//       });
//     } else {
//       res.status(StatusCodes.UNAUTHORIZED).json({
//         message: `이메일 또는 패스워드가 틀렸습니다.`,
//       });
//     }
//   } catch (err) {
//     console.log(err);
//     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//       message: 'Internal Server Error',
//     });
//   }
// };


// const passwordRequestReset = async (req, res) => {
//   try {
//     const {email, password} = req.body;

//     const salt = crypto.randomBytes(64).toString('base64');
//     const hashPassword = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('base64');
    
//     const sql = `UPDATE users SET password = ?, salt = ?  WHERE email = ?`;
    
//     const values = [hashPassword, salt, email];
//     const results = await queryAsync(sql, values);

//     if (results.affectedRows < 0) {
//       return res.status(StatusCodes.NOT_FOUND).json({
//         message: "이메일 틀림"
//       });
//     }
//     res.status(StatusCodes.OK).json({
//       message: `${email}님 비밀번호 초기화 되었습니다`
//     });
//   } catch (err) {
//     console.log(err);
//     return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//       message: "Internal Server Error"
//     });
//   }
// }

// // 비밀번호를 변경하려면 기존 email과 password를 확인 후 새로운 password를 입력받지않나?
// const passwordChange = async (req, res) => {
//   try {
//     const { email, password, newPassword } = req.body;
//     const getUserSql = `SELECT * FROM users WHERE email = ?`;

//     const results = await queryAsync(getUserSql, [email]);

//     if (results.length === 0) {
//       return res.status(StatusCodes.NOT_FOUND).json({
//         message: 'User not found',
//       });
//     }

//     const user = results[0];
//     const hashpassword = crypto.pbkdf2Sync(password, user.salt, 10000, 64, 'sha512').toString('base64');

//     if (user.password !== hashpassword) {
//       return res.status(StatusCodes.UNAUTHORIZED).json({
//         message: 'Current password is incorrect',
//       });
//     }

//     const newSalt = crypto.randomBytes(64).toString('base64');
//     const newHashPassword = crypto.pbkdf2Sync(newPassword, newSalt, 10000, 64, 'sha512').toString('base64');

//     const updatePasswordSql = `UPDATE users SET password = ?, salt = ? WHERE email = ?`;
//     const updatePasswordValues = [newHashPassword, newSalt, email];

//     await queryAsync(updatePasswordSql, updatePasswordValues);

//     const token = jwt.sign(
//       {
//         email: user.email,
//         password: newHashPassword,
//       },
//       process.env.PRIVITE_KEY,
//       {
//         expiresIn: '3m',
//         issuer: 'me',
//       }
//     );

//     res.cookie('token', token, {
//       httpOnly: true,
//     });
//     res.status(StatusCodes.OK).json({
//       message: 'Password changed successfully',
//       token: token,
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//       message: 'Internal Server Error',
//     });
//   }
// };

// // Helper function fro executing queries with promises
// const queryAsync = (sql, values) => {
//   return new Promise((resolve, reject) => {
//     conn.query(sql, values, (err, results) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(results);
//       }
//     });
//   });
// };

// module.exports = {join, login, passwordRequestReset, passwordChange};
