const mysql = require('mysql2/promise');
const {StatusCodes} = require('http-status-codes');

const allCategory = async (req, res) => {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  });

  const sql = `SELECT * FROM category`;
  try {
   const results = await conn.execute(sql);

   if (results.length === 0) {
    return res.status(StatusCodes.NOT_FOUND).end(); 
   }

   return res.status(StatusCodes.OK).json(results);
  } catch (err) {
    console.log(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: '카테고리 조회 중 에러가 발생하였습니다.',
  });
  } finally {
    connection.release();
  }
}

module.exports = {
  allCategory
}