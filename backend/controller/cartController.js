const pool = require("../mariadb");
const ensureAuthorization = require('../auth'); // auth 파일이 있는 경로에 맞게 수정해야 합니다.
const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');

// 데이터베이스 연결 생성
const createConnection = async () => {
  try {
    const conn = await pool.getConnection();
    return conn;
  } catch (err) {
    console.error('Error creating database connection:', err);
    throw err;
  }
};

// 장바구니에 상품 추가
const addToCart = async (req, res) => {
  try {
    const conn = await createConnection(); // 데이터베이스 연결 생성
    const { books_id, quantity, users_id } = req.body;
    const authorization = ensureAuthorization(req, res);
    if (authorization instanceof jwt.TokenExpiredError) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "로그인 세션이 만료되었습니다. 다시 로그인 해주세요",
      });
    } else if (authorization instanceof jwt.JsonWebTokenError) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "토큰 값을 확인해주세요",
      });
    } else {
      const sql = `INSERT INTO cart_items (books_id, quantity, users_id) VALUES (?, ?, ?)`;
      const values = [books_id, quantity, users_id];
      await conn.query(sql, values);
      conn.release(); // 연결 해제
      return res.status(StatusCodes.OK).json({ message: '상품이 장바구니에 추가되었습니다.' });
    }
  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.BAD_REQUEST).end();
  }
};

// 장바구니 아이템 목록 조회
const getCartItems = async (req, res) => {
  try {
    const conn = await createConnection(); // 데이터베이스 연결 생성
    const { selected } = req.body;
    const authorization = ensureAuthorization(req, res);
    if (authorization instanceof jwt.TokenExpiredError) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "로그인 세션이 만료되었습니다. 다시 로그인 해주세요",
      });
    } else if (authorization instanceof jwt.JsonWebTokenError) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "토큰 값을 확인해주세요",
      });
    } else {
      let sql = `SELECT cart_items.id, books_id, title, summary, quantity, price
      FROM cart_items LEFT JOIN books
      ON cart_items.books_id = books.id
      WHERE users_id=?`;
      let values = [authorization.id, selected];
      if (selected) {
        sql += ` AND cart_items.id IN (?)`;
        values.push(selected);
      }
      const results = await conn.query(sql, values);
      conn.release(); // 연결 해제
      return res.status(StatusCodes.OK).json(results);
    }
  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.BAD_REQUEST).end();
  }
};

// 장바구니 아이템 삭제
const removeCartItems = async (req, res) => {
  try {
    const conn = await createConnection(); // 데이터베이스 연결 생성
    const { id } = req.params;
    const sql = `DELETE FROM cart_items WHERE id = ?`;
    await conn.query(sql, [id]);
    conn.release(); // 연결 해제
    return res.status(StatusCodes.OK).json({ message: '장바구니에서 상품이 삭제되었습니다.' });
  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.BAD_REQUEST).end();
  }
};

module.exports = {
  addToCart,
  getCartItems,
  removeCartItems
};
