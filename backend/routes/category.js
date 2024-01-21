const express = require("express");
const router = express.Router();
const { allCategory } = require('../controller/categoryController');

router.get('/', allCategory);

// router.use(express.json());
// // 전체 조회
// router.get('/', (req, res) => {
//   const sql = `SELECT * FROM category`;
  
//   conn.query(sql, (err, results) => {
//     if (err) {
//       console.log(err);
//       return res.status(StatusCodes.BAD_REQUEST).end();
//     }
//     res.status(StatusCodes.OK).json(results);
//   });
// })

// router.get('/:id', (req, res) => {
//   let {id} = req.params;
//   id = parseInt(id);

//   if (id) {
//     const sql = `SELECT * FROM category WHERE id = ?`;

//     conn.query(sql, id, (err, results) => {
//       if(err) {
//         return isError();
//       }

//       if(results[0]){
//         return res.status(StatusCodes.OK).json(results[0]);
//       } else {
//         return res.status(StatusCodes.NOT_FOUND).end();
//       }
//     })
//   } else {
//    return res.status(StatusCodes.NOT_FOUND).json({
//     message: "없음"
//    })
//   }
// })

module.exports = router
