const conn = require('../mariadb');
const {StatusCodes} = require('http-status-codes');

const isError = (res) => {
  console.log(err)
  return res.status(StatusCodes.BAD_REQUEST).end();
}

const allCategory = async (req, res) => {
  const connection = await conn.getConnection();
  const sql = `SELECT * FROM category`;
  try {
   const [rows] = await connection.query(sql);

   if (rows.length === 0) {
    return res.status(StatusCodes.NOT_FOUND).end(); 
   }

   return res.status(StatusCodes.OK).json(rows);
  } catch (err) {
    return isError(res);
  } finally {
    connection.release();
  }
}

module.exports = {
  allCategory
}