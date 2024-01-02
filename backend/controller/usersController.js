const conn = require('../mariadb');
const {StatusCodes} = require('http-status-codes');
// JWT module
const jwt = require( 'jsonwebtoken');
const crypto = require('crypto'); // crypto 모듈 js기본 암호화 모듈

const join = (req, res) => {
  const {email, password} = req.body;
  // 회원가입 시 비밀번호 암호화, 암호화된 비밀번호와 salt 값 같이 저장
  const salt = crypto.randomBytes(64).toString('base64');
  const hashPassword = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('base64');

  const sql = `INSERT INTO users (email, password, salt) VALUES(?, ?, ?)`
  const values = [email, hashPassword, salt];
  
  conn.query(sql, values,
    function(err, results) {
      if (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
      }
      res.status(StatusCodes.CREATED).json({
        message : `${email}님 하이요`
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
      const user = results[0]

      const hashPassword = crypto.pbkdf2Sync(password, user.salt, 10000, 64, 'sha512').toString('base64');

      if(user.password === hashPassword) {
        const token = jwt.sign({
          email: user.email,
          password: user.password
        }, process.env.PRIVITE_KEY, {
          expiresIn: "1h",
          issuer: "me"
        });

        res.cookie("token", token, {
          httpOnly: true
        });
        return res.status(StatusCodes.OK).json({
          message: `${user.email}님 하이요`,
          token: token
        })
      } else {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          message: `이메일이나 패스워드가 틀림요`
        })
      }
    }
);
}

const resetInit = (req, res) => {
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

// const reset = (req, res) => {
//   const {email, password, newPassword} = req.body;
  
//   const sql = `UPDATE users SET password = ? WHERE email = ? AND password = ?`
//   // const salt = crypto.randomBytes(64).toString('base64');
//   // const hashPassword = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('base64');

//   // const values = [newHashPassword, email, hashPassword]
//   conn.query(sql, email,
//     (err, results) => {
//       if (err) {
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//           message: "Internal Server Error"
//         })
//       }
//       if (results.affectedRows < 1) {
//         return res.status(StatusCodes.UNAUTHORIZED).json({
//           message: "이메일이나 패스워드가 틀림요"
//         })
//       }
      
//       const token = jwt.sign({
//         email: email,
//         password: newHashPassword
//       }, process.env.PRIVITE_KEY, {
//         expiresIn: "1h",
//         issuer: "me"
//       })
//       return res.status(StatusCodes.OK).json({
//         message: `비밀번호 변경 완료`,
//         token: token
//       });
//     }
// );
// }

module.exports = {join, login, resetInit, reset};