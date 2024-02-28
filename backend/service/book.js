const pool = require("../mariadb");
/** (카테고리별, 신간 여부별) 전체 도서 조회 */
const getBooks = async ({ category_id, newBook, limit, offset, currentPage }) => {
  currentPage = parseInt(currentPage) || 1;
  if (currentPage < 1) {
      currentPage = 1;
  }
  const connection = await pool.getConnection();
  let findBooksSql = `SELECT SQL_CALC_FOUND_ROWS *,
            (SELECT count(*) FROM likes WHERE books.id = liked_book_id) AS likes
            FROM books`;
  if (category_id) {
      findBooksSql += " WHERE category_id = :category_id";
  }
  if (newBook) {
      findBooksSql += " WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()";
  }
  findBooksSql += " LIMIT :limit OFFSET :offset";
  const values = { category_id, limit: parseInt(limit) || 10, offset: parseInt(offset) || 0 };
  const [results] = await connection.query(findBooksSql, values);
  const books = results;
  const allBooksCountSql = "SELECT found_rows()";
  const [totalCount] = await connection.query(allBooksCountSql, values);
  const pagination = {
      currentPage: parseInt(currentPage),
      totalBooksCount: totalCount[0]["found_rows()"],
  };
  return { books, pagination };
};
/** 개별 도서 조회 */
const getBookById = async (book_id, authorization) => {
  const connection = await pool.getConnection();
  try {
    let sql = `SELECT *, (SELECT count(*) FROM likes WHERE books.id = liked_book_id) AS likes`;
    if (authorization != null) {
        // 로그인 상태이면 liked 추가
        sql += `, (SELECT EXISTS (SELECT * FROM likes WHERE user_id = ? AND liked_book_id = ?)) AS liked`;
    }
    sql += ` FROM books LEFT JOIN category ON books.category_id = category.category_id WHERE books.id = ?`;
    const values = [authorization?.id, book_id, book_id];
    const [results] = await connection.query(sql, values);

    return results.length > 0 ? results[0] : null;
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    connection.release();
  }
  
};
module.exports = { getBooks, getBookById };