const ensureAuthorization = require('../auth');
const mysql = require('mysql2/promise');
const {StatusCodes} = require('http-status-codes');
const jwt = require('jsonwebtoken');

const addToCart = async (req, res) => {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  });

  try {
    const { books_id, quantity, users_id } = req.body;
    const decodedJwt = ensureAuthorization(req, res);
    if (decodedJwt instanceof jwt.TokenExpiredError) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "로그인 세션이 만료되었습니다. 다시 로그인 해주세요",
      });
    } else if (decodedJwt instanceof jwt.JsonWebTokenError) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "토큰 값을 확인해주세요",
      });
    } else {
      const sql = `INSERT INTO cart_items (books_id, quantity, users_id) VALUES (?, ?, ?)`;
      const values = [books_id, quantity, users_id];

      const [results] = await conn.execute(sql, values);
      return res.status(StatusCodes.OK).json(results);
    }
  } catch (err) {
    console.log(err);
    return res.status(StatusCodes.BAD_REQUEST).end();
  }
}

// 장바구니 아이템 목록 조희 // 장바구니 예상 상품 목록 조희
const getCartItems = async (req, res) => {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  });

  try {
    const { users_id, selected } = req.body;
    const decodedJwt = ensureAuthorization(req, res);
    if (decodedJwt instanceof jwt.TokenExpiredError) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "로그인 세션이 만료되었습니다. 다시 로그인 해주세요",
      });
    } else if (decodedJwt instanceof jwt.JsonWebTokenError) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "토큰 값을 확인해주세요",
      });
    } else {
      const sql = `SELECT cart_items.id, books_id, title, summary, quantity, price
      FROM cart_items LEFT JOIN books
      ON cart_items.books_id = books.id
      WHERE users_id=? AND cart_items.id IN (?)`;
      const values = [users_id, selected];
      const [results] = await conn.execute(sql, values);
      return res.status(StatusCodes.OK).json(results);
    }
  } catch (err) {
    console.log(err);
    return res.status(StatusCodes.BAD_REQUEST).end();
  }
}

// 장바구니 아이템 삭제
const removeCartItems = async (req, res) => {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  });

  try {
    const { id } = req.params;
    const sql = `DELETE FROM cart_items WHERE id = ?`;

    const [results] = await conn.execute(sql, id);
    return res.status(StatusCodes.OK).json(results);
  } catch (err) {
    console.log(err);
    return res.status(StatusCodes.BAD_REQUEST).end();
  }
}

module.exports = {
  addToCart,
  getCartItems,
  removeCartItems
}