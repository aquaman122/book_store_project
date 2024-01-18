const mysql = require('mysql2/promise');
const {StatusCodes} = require('http-status-codes');

const getBooks = async (req, res) => {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  });

  try {
    const { category_id, news, limit, currentPage } = req.query;
    const parsedLimit = parseInt(limit);
    const parsedCurrentPage = parseInt(currentPage);
    const offset = parsedLimit * (parsedCurrentPage - 1);
    const values = [];

    let sql = `SELECT *, (SELECT COUNT(*) FROM likes WHERE books.id = liked_books_id) AS likes FROM books`;

    if (category_id && news) {
      sql += ` LEFT JOIN category on books.category_id = category.category_id WHERE books.category_id = ? and pub_date BETWEEN date_sub(NOW(), INTERVAL 1 MONTH) AND NOW()`;
      values.push(category_id);
    } else if (category_id) {
      sql += ' LEFT JOIN category on books.category_id = category.category_id WHERE books.category_id = ?';
      values.push(category_id);
    } else if (news) {
      sql += ` WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()`;
    }

    sql += ' limit ?, ?';
    values.push(offset, parsedLimit);

    const results = await conn.execute(sql, values);

    if (results.length === 0) {
      const message = category_id ? '해당하는 도서가 없습니다.' : '도서가 없습니다.';
      return res.status(StatusCodes.NOT_FOUND).json({ message });
    }

    return res.status(StatusCodes.OK).json(results);
  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.BAD_REQUEST).end();
  }
};

const bookDetail = async (req, res) => {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  });

  try {
    const { users_id } = req.body;
    if (authorization instanceof jwt.TokenExpiredError) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: '로그인 세션이 만료되었습니다. 다시 로그인 해주세요',
      });
    } else if (authorization instanceof jwt.JsonWebTokenError) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: '토큰 값을 확인해주세요',
      });
    } else if (authorization instanceof ReferenceError) {
      const booksId = req.params.id;  
      const sql = `SELECT *,
      (SELECT COUNT(*) FROM likes WHERE liked_books_id = books.id) AS likes
      FROM books
      LEFT JOIN category ON books.category_id = category.category_id WHERE books.id = ?;
      `;
      const values = [booksId];
      const results = await conn.execute(sql, values);

      if (results[0]) {
        res.status(StatusCodes.OK).json(results[0]);
      } else {
        res.status(StatusCodes.NOT_FOUND).end();
      }
    } else {
      const booksId = req.params.id;
      const sql = `SELECT *,
        (SELECT COUNT(*) FROM likes WHERE liked_books_id = books.id) AS likes,
        (SELECT EXISTS (SELECT * FROM likes WHERE users_id = ? AND liked_books_id = ?)) AS liked
        FROM books
        LEFT JOIN category ON books.category_id = category.category_id WHERE books.id = ?;
      `;
      const values = [users_id, booksId, booksId];
      const results = await conn.execute(sql, values);

      if (results[0]) {
        res.status(StatusCodes.OK).json(results[0]);
      } else {
        res.status(StatusCodes.NOT_FOUND).end();
      }
    }
  } catch (err) {
    console.error(err);
    res.status(StatusCodes.BAD_REQUEST).end();
  }
};

module.exports = {
  getBooks,
  bookDetail
}