const pool = require('../mariadb'); // mariadb.js 파일에서 pool 가져오기
const { StatusCodes } = require('http-status-codes');

const orders = async (req, res) => {
  const connection = await pool.getConnection();
  const user_id = req.user_id;
  const { items, firstBookTitle, delivery, totalQuantity, totalPrice} = req.body;
  const sqlInsertDelivery = `INSERT INTO delivery (address, receiver, contact) VALUES (?, ?, ?)`;
  const valuesDelivery = [delivery.address, delivery.receiver, delivery.contact];
  const sqlInsertOrders = `INSERT INTO orders (books_title, total_quantity, total_price, user_id, delivery_id) VALUES (?, ?, ?, ?, ?)`;
  const sqlInsertOrderedBooks = `INSERT INTO ordered_books (orders_id, books_id, quantity) VALUES (?, ?, ?)`;
  try {
    // 다 const 로 바꾸고 새로운명칭의 변수로 바꿔주기
    const [results] = await connection.query(sqlInsertDelivery, valuesDelivery);
    const delivery_id = results.insertId;

    const valuesOrders = [firstBookTitle, totalQuantity, totalPrice, user_id, delivery_id];
    const [resultsOrders] = await connection.query(sqlInsertOrders, valuesOrders);
    const order_id = resultsOrders.insertId;

    for (const item of items) {
      const valuesOrderedBooks = [order_id, item, items.length];
      await connection.query(sqlInsertOrderedBooks, valuesOrderedBooks);
    }

    return res.status(StatusCodes.OK).json({
      message: '주문이 완료되었습니다.',
    });
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  } finally {
    connection.release();
  }
};

const getOrders = async (req, res) => {
  const connection = await pool.getConnection();
  const sqlSelect = `
    SELECT orders.*, delivery.address, delivery.receiver, delivery.contact
    FROM orders
    JOIN delivery ON orders.delivery_id = delivery.id`;
  try {
    const [results] = await connection.query(sqlSelect);

    if (results.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: '주문 내역이 없습니다.',
      });
    }

    return res.status(StatusCodes.OK).json(results);
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  } finally {
    connection.release();
  }
};

const getOrdersDetail = async (req, res) => {
  const connection = await pool.getConnection();
  const user_id = req.user_id;
  const order_id = req.params.id;
  const sqlSelect = `SELECT orders.*, delivery.address, delivery.receiver, delivery.contact FROM orders
  JOIN delivery ON orders.delivery_id = delivery.id WHERE orders.id = ? AND orders.user_id = ?`;
  const values = [order_id, user_id];
  try {
    const [results] = await connection.query(sqlSelect, values);

    if (results.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: '주문 내역이 없습니다.',
      });
    }
    
    return res.status(StatusCodes.OK).json(results);
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  } finally {
    connection.release();
  }
};

const deleteOrder = async (req, res) => {
  const connection = await pool.getConnection();
  const user_id = req.user_id;
  const order_id = req.params.id;
  const sqlSelectOrder = `SELECT * FROM orders WHERE id=?`;
  const sqlDeleteOrderedBooks = `DELETE FROM ordered_books WHERE orders_id=?`;
  const sqlDeleteOrder = `DELETE FROM orders WHERE id=?`;
  const sqlDeleteDelivery = `DELETE FROM delivery WHERE id=?`;

  try {
    const [results] = await connection.query(sqlSelectOrder, order_id);

    if (results.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: '주문 내역이 없습니다.',
      });
    }
    if (results[0].user_id !== user_id) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: '권한이 없습니다.',
      });
    }
    await connection.query(sqlDeleteOrderedBooks, order_id);

    const delivery_id = results[0].delivery_id;

    await connection.query(sqlDeleteOrder, order_id);
    await connection.query(sqlDeleteDelivery, delivery_id);

    return res.status(StatusCodes.OK).json({
      message: '주문이 취소되었습니다.',
    });
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  } finally {
    connection.release();
  }
};

module.exports = {
  orders,
  getOrders,
  getOrdersDetail,
  deleteOrder
};
