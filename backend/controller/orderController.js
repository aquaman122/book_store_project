const conn = require('../mariadb');
const {StatusCodes} = require('http-status-codes');

const orders = (req, res) => {
  const { items, first_book_title, delivery, total_quantity, total_price, users_id} = req.body;

  let delivery_id;
  let orders_id;

  let sql = `INSERT INTO delivery (address, receiver, contact) VALUES (?, ?, ?)`
  let values = [delivery.address, delivery.receiver, delivery.contact];

  // conn.query(sql, values, (err, results) => {
  //   if(err) {
  //     console.log(err);
  //     return res.status(StatusCodes.BAD_REQUEST).end();
  //   }

  //   delivery_id = results.insertId;
  //   return res.status(StatusCodes.OK).json(results);
  // });

  // sql = `INSERT INTO orders (books_title, total_quantity, total_price, users_id, delivery_id)
  //         VALUES (?, ?, ?, ?, ?)`;
  // values = [first_book_title, total_quantity, total_price, users_id, delivery_id];
  // conn.query(sql, values, (err, results) => {
  //   if (err) {
  //     console.log(err);
  //     return res.status(StatusCodes.BAD_REQUEST).end();
  //   }

  //   orders_id = results.insertId;

  //   return res.status(StatusCodes.OK).json(results);
  // });

  sql = `INSERT INTO ordered_books (orders_id, books_id, quantity) VALUES ?`;
  values = [];
  // items.. 배열 : 요소들을 하나씩 꺼내서 forEach
  items.forEach(item => {
    values.push([orders_id, item.books_id, item.quantity]);
  });
  conn.query(sql, [values], (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    orders_id = results.insertId;

    return res.status(StatusCodes.OK).json(results);
  });
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