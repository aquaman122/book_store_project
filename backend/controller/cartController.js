const conn = require('../mariadb');
const {StatusCodes} = require('http-status-codes');
// JWT module
const jwt = require( 'jsonwebtoken');
const crypto = require('crypto'); // crypto 모듈 js기본 암호화 모듈

const isError = (res) => {
  console.log(err)
  return res.status(StatusCodes.BAD_REQUEST).end();
}

const addToCart = (req, res) => {
  const {books_id, quantity, users_id} = req.body;
  const sql = `INSERT INTO cart_items (books_id, quantity, users_id) VALUES (?, ?, ?)`;
  const values = [books_id, quantity, users_id];

  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    return res.status(StatusCodes.OK).json(results);
  })
}

// 장바구니 아이템 목록 조희 // 장바구니 예상 상품 목록 조희
const getCartItems = (req, res) => {
  const {users_id, selected} = req.body;

  const sql = `SELECT cart_items.id, books_id, title, summary, quantity, price
  FROM cart_items LEFT JOIN books
  ON cart_items.books_id = books.id
  WHERE users_id=? AND cart_items.id IN (?)`;

  const values = [users_id, selected];
  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    return res.status(StatusCodes.OK).json(results);
  })
}

// 장바구니 아이템 삭제
const removeCartItems = (req, res) => {
  const { id } = req.params;

  const sql = `DELETE FROM cart_items WHERE id = ?`;

  conn.query(sql, id, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    return res.status(StatusCodes.OK).json(results);
  })
}

module.exports = {
  addToCart,
  getCartItems,
  removeCartItems
}