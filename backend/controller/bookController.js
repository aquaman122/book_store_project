const mysql = require('mysql2/promise');
const {StatusCodes} = require('http-status-codes');

const allBooks = async (req, res) => {
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
    let values = [];

    let sql = `SELECT *, (SELECT COUNT(*) FROM likes WHERE books.id = liked_books_id) AS likes FROM books`;

    if (category_id && news) {
      sql += ` WHERE category_id=? AND pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()`;
      values = [category_id];
    } else if (category_id) {
      sql += ` LEFT JOIN category ON books.category_id = category.category_id WHERE books.category_id = ? AND pub_date BETWEEN date_sub(NOW(), INTERVAL 1 MONTH) AND NOW()`;
      values = [category_id];
    } else if (news) {
      sql += ` WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()`;
    }

    sql += ` LIMIT ? OFFSET ?`;

    if (isNaN(parsedLimit)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid limit parameter' });
    }
    values.push(parsedLimit, offset);

    const [results] = await conn.execute(sql, values);

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
  } catch (err) {
    console.error(err);
    res.status(StatusCodes.BAD_REQUEST).end();
  }
};

module.exports = {
  allBooks,
  bookDetail
}