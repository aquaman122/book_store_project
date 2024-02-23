const mariadb = require('mariadb');
require('dotenv').config();

// 커넥션 풀 생성
const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  connectionLimit: 5 // 적절한 연결 수 설정
});

module.exports = pool;
