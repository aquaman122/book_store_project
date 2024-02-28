const pool = require('../mariadb'); // mariadb.js 파일에서 pool 가져오기
const {verifyToken} = require('../middleware/ensureAuthorization');
const jwt = require("jsonwebtoken")
const { StatusCodes } = require('http-status-codes');

const addLike = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    let bookId = req.params.id;
    parseInt(bookId);
    const authorization = verifyToken(req, res);

    if (authorization instanceof jwt.TokenExpiredError) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
          message: "로그인 토큰이 만료되었습니다. 다시 로그인하세요.",
      });
   }

    if (authorization instanceof jwt.JsonWebTokenError) {
      console.log(jwt.JsonWebTokenError);
      return res.status(StatusCodes.BAD_REQUEST).json({
          message: "잘못된 토큰입니다.",
      });
    }
    if (authorization == null) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
          message: "로그인이 필요합니다.",
      });
    }
      const sql = 'INSERT INTO likes (user_id, liked_book_id) VALUES (?, ?)';
      const values = [authorization.id, bookId];
      const [results] = await connection.query(sql, values);
      return res.status(StatusCodes.CREATED).json(results);
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  } finally {
    connection.release();
  }
};

const removeLike = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    let bookId = req.params.id;
    parseInt(bookId);
    const authorization = verifyToken(req, res);

    if (authorization instanceof jwt.TokenExpiredError) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
          message: "로그인 토큰이 만료되었습니다. 다시 로그인하세요.",
      });
    } 
    if (authorization instanceof jwt.JsonWebTokenError) {
      console.log(jwt.JsonWebTokenError);
      return res.status(StatusCodes.BAD_REQUEST).json({
          message: "잘못된 토큰입니다.",
      });
    } 
    if (authorization == null) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
          message: "로그인이 필요합니다.",
      });
    }
     
    const sql = "DELETE FROM likes WHERE user_id = ? AND liked_book_id = ?";
    const values = [authorization.id, bookId];
    const [results] = await connection.query(sql, values);
    return res.status(StatusCodes.OK).json(results);
  
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  } finally {
    connection.release();
  }
};

module.exports = {
  addLike,
  removeLike,
};
