const conn = require('../mariadb');
const {StatusCodes} = require('http-status-codes');
// JWT module
const jwt = require( 'jsonwebtoken');
const crypto = require('crypto'); // crypto 모듈 js기본 암호화 모듈

const addLike = (req, res) => {

  const {id} = req.params;
  const {users_id} = req.body;

  const sql = `INSERT INTO likes (users_id, liked_books_id) VALUES (?, ?)`;
  const values = [users_id, id];

  conn.query(sql, values, (err, results) => {
    if (err) {
      res.status(StatusCodes.BAD_REQUEST).end();
    }

    return res.status(StatusCodes.OK).json(results);
  })
};

const removeLike = (req, res) => {
  const {id} = req.params;
  const {users_id} = req.body;

  const sql = `DELETE FROM likes WHERE users_id = ? AND liked_books_id = ?`
  const values = [users_id, id];

  conn.query(sql, values, (err, results) => {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    return res.status(StatusCodes.OK).json(results);
  })
}

module.exports = {
  addLike,
  removeLike
}