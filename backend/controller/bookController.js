const conn = require('../mariadb');
const {StatusCodes} = require('http-status-codes');
// JWT module
const jwt = require( 'jsonwebtoken');
const crypto = require('crypto'); // crypto 모듈 js기본 암호화 모듈

const isError = (res) => {
  console.log(err)
  return res.status(StatusCodes.BAD_REQUEST).end();
}

const allBooks = (req, res) => {
  const { category_id, news, limit, currentPage } = req.query;

  const offset = limit * (currentPage - 1);

  let sql = `SELECT *, (SELECT count(*) FROM likes WHERE books.id = liked_books_id) AS likes FROM books`;
  let values = [];
  // 카테고리별로 조회
  if (category_id && news) {
    sql += ` WHERE category_id=? AND pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()`;
    values = [category_id];
  } else if (category_id) {
    sql += ` WHERE category_id=?`;
    values = [category_id];
  } else if (news) {
    sql += ` WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()`;
  }

  sql += ` LIMIT ? OFFSET ?`;
  values.push(parseInt(limit), offset);

  conn.query(sql, values, (err, results) => {
    if (err) {
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    if (results.length) {
      return res.status(StatusCodes.OK).json(results);
    } else {
      return res.status(StatusCodes.NOT_FOUND).end();
    }
  })
}

const bookDetail = (req, res) => {
  const {users_id} = req.body;
  const books_id = req.params.id;
  const sql = `SELECT *,
    (SELECT count(*) FROM likes WHERE liked_books_id = books.id) AS likes,
    (SELECT EXISTS (SELECT * FROM likes WHERE users_id = ? AND liked_books_id = ?)) AS liked,
    FROM books
    LEFT JOIN category ON books.category_id = category.category_id WHERE books.id = ?;  
  `;
  const values = [users_id, books_id, books_id];
  conn.query(sql, values, (err, results) => {
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