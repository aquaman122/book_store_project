const pool = require("../mariadb");
const { StatusCodes } = require('http-status-codes');

const allCategory = async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    // 쿼리
    const rows = await conn.query(`SELECT * FROM category`);

    if (rows.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).end(); 
    }

    return res.status(StatusCodes.OK).json(rows);
  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: '카테고리 조회 중 에러가 발생하였습니다.'
    });
  } finally {
    if (conn) {
      conn.end(); // 커넥션 반환
    }
  }
};

module.exports = {
  allCategory
};


// const connection = require("../mariadb");
// const { StatusCodes } = require('http-status-codes');

// const allCategory = async (req, res) => {
//   try {
//     // 쿼리
//     const [results] = await connection.query(`SELECT * FROM category`);

//     if (results.length === 0) {
//       return res.status(StatusCodes.NOT_FOUND).end(); 
//     }

//     return res.status(StatusCodes.OK).json(results);
//   } catch (err) {
//     console.error(err);
//     return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//       error: '카테고리 조회 중 에러가 발생하였습니다.'
//     });
//   }
// };

// module.exports = {
//   allCategory
// };