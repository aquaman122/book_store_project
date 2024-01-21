const mysql = require('mysql2/promise');
const ensureAuthorization = require('../auth');
const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
require('dotenv').config();

const addLike = async (req, res) => {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  });

  const bookId = req.params.id;

  try {
    const authorization = ensureAuthorization(req, res);

    if (authorization instanceof jwt.TokenExpiredError) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: '로그인 세션이 만료되었습니다. 다시 로그인 해주세요',
      });
    } else if (authorization instanceof jwt.JsonWebTokenError) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: '토큰 값을 확인해주세요',
      });
    } else {
      const sql = 'INSERT INTO likes (users_id, liked_books_id) VALUES (?, ?)';
      const values = [authorization.id, bookId];

      const [results] = await conn.query(sql, values);
      return res.status(StatusCodes.CREATED).json(results);
    }
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
};

const removeLike = async (req, res) => {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  });
  const bookId = req.params.id;

  try {
    const authorization = ensureAuthorization(req, res);

    if (authorization instanceof jwt.TokenExpiredError) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: '로그인 세션이 만료되었습니다. 다시 로그인 해주세요',
      });
    } else if (authorization instanceof jwt.JsonWebTokenError) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: '토큰 값을 확인해주세요',
      });
    } else {
      const sql = 'DELETE FROM likes WHERE users_id = ? AND liked_books_id = ?';
      const values = [authorization.id, Number(bookId)];

      const [results] = await conn.query(sql, values);
      return res.status(StatusCodes.OK).json(results);
    }
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
};

module.exports = {
  addLike,
  removeLike,
};
