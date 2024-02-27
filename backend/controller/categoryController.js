const pool = require("../mariadb");
const { StatusCodes } = require('http-status-codes');

const allCategory = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    // 쿼리
    const sql = "SELECT * FROM category";
    const [results] = await connection.query(sql);

    if (results.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).end(); 
    }

    return res.status(StatusCodes.OK).json(results);
  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: '카테고리 조회 중 에러가 발생하였습니다.'
    });
  } finally {
    connection.release();
  }
};

module.exports = {
  allCategory
};
