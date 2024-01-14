const mysql = require('mysql2/promise');
const {StatusCodes} = require('http-status-codes');

const orders = async (req, res) => {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  });

  const { items, first_book_title, delivery, total_quantity, total_price, users_id} = req.body;

  let orders_id;
  // 다 const 로 바꾸고 새로운명칭의 변수로 바꿔주기
  let sql = `INSERT INTO delivery (address, receiver, contact) VALUES (?, ?, ?)`
  let values = [delivery.address, delivery.receiver, delivery.contact];
  let [results] = await conn.execute(sql, values);
  const delivery_id = results.insertId;

  sql = `INSERT INTO orders (books_title, total_quantity, total_price, users_id, delivery_id)
          VALUES (?, ?, ?, ?, ?)`;
  values = [first_book_title, total_quantity, total_price, users_id, delivery_id];
  [results] = await conn.execute(sql, values);

  sql = `INSERT INTO ordered_books (orders_id, books_id, quantity) VALUES ?`;
  values = [];
  // items.. 배열 : 요소들을 하나씩 꺼내서 forEach
  items.forEach(item => {
    values.push([orders_id, item.books_id, item.quantity]);
  });
  results = await conn.query(sql, [values]);

  return res.status(StatusCodes.OK).json(results[0]);
};

const getOrders = (req, res) => {
  res.send("1");
}

const getOrdersDetail = (req, res) => {
  res.send("1");
}

module.exports = {
  orders,
  getOrders,
  getOrdersDetail
}