const pool = require('../mariadb'); // mariadb.js 파일에서 pool 가져오기
const { StatusCodes } = require('http-status-codes');

const sqlSelect = `SELECT * FROM likes WHERE user_id = ? AND liked_book_id = ?`;

const checkExistValues = async (connection, values) => {
  const checkExist = `SELECT (SELECT COUNT(*) FROM users WHERE id = ?) AS user_exists, (SELECT COUNT(*) FROM books WHERE id = ?) AS book_exists`;
  const [rows] = await connection.query(checkExist, values);

  return { 
      userExists: rows[0].user_exists === 1,
      bookExists: rows[0].book_exists === 1,
  };
};

const addLike = async (req, res) => {
  const connection = await pool.getConnection();
  const books_id = req.params.id;
  const user_id = req.user_id;
  const sqlInsert = 'INSERT INTO likes (user_id, liked_book_id) VALUES (?, ?)';
  const values = [user_id, books_id];

  try {
    const { book_exists } = await checkExistValues(connection, values);

    if (!book_exists) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "책 없음."
      });
    }
    const [results] = await connection.query(sqlInsert, values);

    if (results.affectedRows > 0) {
      return res.status(StatusCodes.CREATED).json({
        message: "좋아요 추가 성공."
      });
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "좋아요 추가 실패."
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  } finally {
    connection.release();
  }
};

const removeLike = async (req, res) => {
  const connection = await pool.getConnection();
  const books_id = req.params.id;
  const user_id = req.user_id;
  const sqlDelete = 'DELETE FROM likes WHERE user_id = ? AND liked_book_id = ?';
  const values = [user_id, books_id];

  try {
    const { user_exists, book_exists } = await checkExistValues(connection, values);

    if (!user_exists) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "사용자 없음."
      });
    }

    if (!book_exists) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "책 없음."
      });
    }

    const [results] = await connection.query(sqlSelect, values);

    if (results.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "좋아요 없음."
      });
    }

    const [deleteResults] = await connection.query(sqlDelete, values);

    if (deleteResults.affectedRows > 0) {
      return res.status(StatusCodes.OK).json({
        message: "좋아요 삭제 성공."
      });
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "좋아요 삭제 실패."
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  } finally {
    connection.release();
  }
};

module.exports = {
  addLike,
  removeLike,
};
