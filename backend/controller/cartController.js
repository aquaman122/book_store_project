const pool = require("../mariadb");
const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');

const checkExist = `SELECT (SELECT COUNT(*) FROM users WHERE id = ?) AS user_exists, (SELECT COUNT(*) FROM books WHERE id = ?) AS book_exists`

const checkExistValues = async (connection, values) => {
  const [rows] = await connection.query(checkExist,values);
  return {
    user_exists: rows[0].user_exists === 1,
    book_exists: rows[0].book_exists === 1,
  }
}

// 장바구니에 상품 추가
const addToCart = async (req, res) => {
  const connection = await pool.getConnection();
  const { books_id, quantity } = req.body;
  const user_id = req.user_id;

  const sqlInsertCart = 'INSERT INTO cart_items (books_id, quantity, user_id) VALUES (?, ?, ?)';
  const sqlSelectCart = 'SELECT * FROM cart_items WHERE user_id = ? AND books_id = ?';
  const sqlUpdateCart = 'UPDATE cart_items SET quantity = quantity + ? WHERE user_id = ? AND books_id = ?';
  const values = [books_id, quantity, user_id];
  const existValues = [user_id, books_id];

  try {
    const { book_exists } = await checkExistValues(connection, existValues)

    if (!book_exists) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "책 없음."
      });
    }

    const [results] = await connection.query(sqlSelectCart, existValues);

    if (results.length > 0) {
      const [resultsUpdate] = await connection.query(sqlUpdateCart, [quantity, user_id, books_id]);

      if (resultsUpdate.affectedRows > 0) {
        return res.status(StatusCodes.OK).json({
          message: "이미 장바구니에 있음"
        });
      } else {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "장바구니 추가 실패.",
        });
      }
    }

    const [resultsInsert] = await connection.query(sqlInsertCart, values);

    if (resultsInsert.affectedRows > 0) {
      return res.status(StatusCodes.CREATED).json({
        message: "장바구니에 도서 추가.",
      });
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "장바구니 추가 실패."
      });
    }
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "장바구니 추가 문제 발생."
    });
  } finally {
    connection.release();
  }
  }

// 장바구니 아이템 목록 조회
const getCartItems = async (req, res) => {
  const connection = await pool.getConnection();
  const user_id = req.user_id;
  const { selected } = req.body;

  const sqlSelectAllCart = `SELECT cart_items.id, books_id, title, summary, quantity, price
  FROM cart_items LEFT JOIN books ON cart_items.books_id = books.id WHERE user_id = ?`;
  const sqlSelectSelectedCart = `SELECT cart_items.id, books_id, title, summary, quantity, price FROM cart_items
  LEFT JOIN books ON cart_items.books_id = books.id WHERE user_id = ? AND cart_items.id IN (?)`;

  let sqlSelectCart;
  let values;

  if (selected && selected.length > 0) {
    sqlSelectCart = sqlSelectSelectedCart;
    values = [user_id, selected];
  } else {
    sqlSelectCart = sqlSelectAllCart;
    values = [user_id];
  }

  try {
    const [rowsSelect] = await connection.query(sqlSelectCart, [user_id, selected]);

    if (rowsSelect.length > 0) {
      return res.status(StatusCodes.OK).json(rowsSelect);
    } else {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "장바구니안에 도서없음."
      });
    }
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "장바구니 조회 중 문제 발생."
    });
  } finally {
    connection.release();
  }
  
};


// 장바구니 아이템 삭제
const removeCartItems = async (req, res) => {
  const connection = await pool.getConnection();
    const books_id = req.params.id;
    const user_id = req.user_id;
    const values = [books_id, user_id];

    const sqlDeleteCart = 'DELETE FROM cart_items WHERE id = ? AND user_id = ?';

  try {
    const [rowDelete] = await connection.query(sqlDeleteCart, values);

    if (rowDelete.affectedRows > 0) {
      return res.status(StatusCodes.OK).json({
        message: "장바구니 도서 삭제."
      });
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "장바구니 도서 삭제 불가."
      });
    }
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "장바구니 도서 삭제중 문제 발생."
    });
  } finally {
    connection.release();
  }
};

module.exports = {
  addToCart,
  getCartItems,
  removeCartItems
};
