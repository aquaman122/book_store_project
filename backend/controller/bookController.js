const conn = require('../mariadb');
const {StatusCodes} = require('http-status-codes');
// JWT module
const jwt = require( 'jsonwebtoken');
const crypto = require('crypto'); // crypto 모듈 js기본 암호화 모듈

const isError = (res) => {
  return res.status(StatusCodes.NOT_FOUND).json({
    message: "오류임.."
  });
}

const allBooks = (req, res) => {
  const {category_id} = req.query;
  // 카테고리별로 조회
  if (category_id) {
    const sql = `SELECT * FROM books WHERE category_id = ?`;

    conn.query(sql, id, (err, results) => {
      if(err) {
        return isError();
      }

      if(results[0]){
        return res.status(StatusCodes.OK).json(results[0]);
      } else {
        return res.status(StatusCodes.NOT_FOUND).end();
      }
    })
  } else {
    const sql = `SELECT * FROM books`;

    conn.query(sql, (err, results) => {
      if(err) {
        return isError();
      }
      res.json(results);
    })
  }
}

const bookDetail = (req, res) => {
  let {id} = req.params;
  const sql = `SELECT * FROM books LEFT JOIN category
                ON books.category_id = category.id WHERE books.id = ?`;

  conn.query(sql, id, (err, results) => {
    if(err) {
      return isError();
    }

    if(results[0]){
      return res.status(StatusCodes.OK).json(results[0]);
    } else {
      return res.status(StatusCodes.NOT_FOUND).end();
    }
  })
}

module.exports = {
  allBooks,
  bookDetail
}