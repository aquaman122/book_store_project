const pool = require('../mariadb');
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

// 도서 목록 조회
const getBooks = async (req, res) => {
  try {
    const conn = await createConnection(); // 데이터베이스 연결 생성
    const { category_id, news, limit, currentPage } = req.query;
    const parsedLimit = parseInt(limit) || 10; // 정수형으로 변환하고, NaN인 경우에는 기본값으로 10을 사용합니다.
    const parsedCurrentPage = parseInt(currentPage) || 1; // 정수형으로 변환하고, NaN인 경우에는 기본값으로 1을 사용합니다.
    const offset = parsedLimit * (parsedCurrentPage - 1);
    const values = [];

    let sql = `SELECT books.id, books.title, books.author, books.pub_date,
      (SELECT COUNT(*) FROM likes WHERE liked_books_id = books.id) AS likes`;

    if (category_id && news) {
      sql += ` FROM books LEFT JOIN category on books.category_id = category.category_id WHERE books.category_id = ? and pub_date BETWEEN date_sub(NOW(), INTERVAL 1 MONTH) AND NOW()`;
      values.push(category_id);
    } else if (category_id) {
      sql += ' FROM books LEFT JOIN category on books.category_id = category.category_id WHERE books.category_id = ?';
      values.push(category_id);
    } else if (news) {
      sql += ` FROM books WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()`;
    } else {
      sql += ' FROM books';
    }

    sql += ' LIMIT ?, ?';
    values.push(offset, parsedLimit);

    const results = await conn.query(sql, values);
    conn.release(); // 연결 해제

    // BigInt 값을 문자열로 변환하여 직렬화
    const serializedResults = results.map(book => {
      return {
        id: book.id.toString(), // BigInt 값을 문자열로 변환
        title: book.title,
        author: book.author,
        pub_date: book.pub_date,
        likes: book.likes.toString() // BigInt 값을 문자열로 변환
        // 기타 필요한 속성들도 필요에 따라 처리
      };
    });

    if (serializedResults.length === 0) {
      const message = category_id ? '해당하는 도서가 없습니다.' : '도서가 없습니다.';
      return res.status(StatusCodes.NOT_FOUND).json({ message });
    }

    return res.status(StatusCodes.OK).json(serializedResults);
  } catch (err) {
    console.error('Error fetching books:', err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
};

// 도서 상세 정보 조회
const bookDetail = async (req, res) => {
  try {
    const conn = await createConnection(); // 데이터베이스 연결 생성
    const { users_id } = req.body;
    const booksId = req.params.id;

    let sql, values;
    if (!users_id) {
      sql = `SELECT books.id, books.title, books.author, books.summary, books.price,
      (SELECT COUNT(*) FROM likes WHERE liked_books_id = books.id) AS likes
      FROM books
      LEFT JOIN category ON books.category_id = category.category_id WHERE books.id = ?`;
      values = [booksId];
    } else {
      sql = `SELECT books.id, books.title, books.author, books.summary, books.price,
        (SELECT COUNT(*) FROM likes WHERE liked_books_id = books.id) AS likes,
        (SELECT EXISTS (SELECT * FROM likes WHERE users_id = ? AND liked_books_id = ?)) AS liked
        FROM books
        LEFT JOIN category ON books.category_id = category.category_id WHERE books.id = ?`;
      values = [users_id, booksId, booksId];
    }

    const results = await conn.query(sql, values);
    conn.release(); // 연결 해제

    if (results.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).end();
    }

    // BigInt 값을 문자열로 변환하여 직렬화
    const serializedResult = {
      id: results[0].id.toString(), // BigInt 값을 문자열로 변환
      title: results[0].title,
      author: results[0].author,
      summary: results[0].summary,
      price: results[0].price,
      likes: results[0].likes.toString() // BigInt 값을 문자열로 변환
    };

    return res.status(StatusCodes.OK).json(serializedResult);
  } catch (err) {
    console.error('Error fetching book details:', err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
};

module.exports = {
  getBooks,
  bookDetail
};
