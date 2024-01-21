const mysql = require('mysql2/promise');
const ensureAuthorization = require('../auth');
const {StatusCodes} = require('http-status-codes');

const orders = async (req, res) => {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  });

  const authorization = ensureAuthorization(req, res);

  if (authorization instanceof jwt.TokenExpiredError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: '로그인 세션이 만료되었습니다. 다시 로그인 해주세요',
    });
  } else if (authorization instanceof jwt.JsonWebTokenError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: '토큰 값을 확인해주세요',
    });
  } else {
    const { items, first_book_title, delivery, total_quantity, total_price} = req.body;

    // 다 const 로 바꾸고 새로운명칭의 변수로 바꿔주기
    let sql = `INSERT INTO delivery (address, receiver, contact) VALUES (?, ?, ?)`
    let values = [delivery.address, delivery.receiver, delivery.contact];

    let [results] = await conn.execute(sql, values);
    const delivery_id = results.insertId;

    sql = `INSERT INTO orders (books_title, total_quantity, total_price, users_id, delivery_id)
            VALUES (?, ?, ?, ?, ?)`;
    values = [first_book_title, total_quantity, total_price, authorization.id, delivery_id];
    [results] = await conn.execute(sql, values);
    let orders_id = results.insertId;

    // items
    sql = `SELECT books_id, quantity FROM cart_items WHERE id IN (?)`;
    const [orderItems, fields] = await conn.query(sql, [items]);

    sql = `INSERT INTO ordered_books (orders_id, books_id, quantity) VALUES (?)`;
    values = [];
    // items.. 배열 : 요소들을 하나씩 꺼내서 forEach
    orderItems[0].forEach(item => {
      values.push([orders_id, item.books_id, item.quantity]);
    });
    results = await conn.query(sql, [values]);

    results = deleteCartItems(conn, items);
    return res.status(StatusCodes.OK).json(results[0]);
  }
};

// module
const deleteCartItems =  async (conn, items) => {
  const sql = `DELETE FROM cart_items WHERE id IN (?)`;

  const result = await conn.query(sql, items);
  return result;
}

const getOrders = async (req, res) => {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  });

  const sql = `SELECT orders.id, books_title, total_quantity, total_price, created_at, address, receiver, contact, FROM orders LEFT OUTER JOIN delivery ON orders.delivery_id=delivery.id`;
  const [results] = await conn.execute(sql, []);
  return res.status(StatusCodes.OK).json(results);
}

const getOrdersDetail = async (req, res) => {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  });
  const {id} = req.params;
  const sql = `SELECT books.id,books.title,books.author,books.price,ordered_books.quantity
  FROM ordered_books LEFT OUTER JOIN books
  ON ordered_books.books_id=books.id
   WHERE order_id=?`
  const values = [id];
  const [results] = await conn.execute(sql, values);

  return res.status(StatusCodes.OK).json(results);
}

module.exports = {
  orders,
  getOrders,
  getOrdersDetail
}
