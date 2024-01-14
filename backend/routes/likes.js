const express = require("express");
const router = express.Router();
// connection mariadb module
const conn = require('../mariadb');

const {addLike, removeLike} = require('../controller/likeController');
// JWT module

// 좋아요 추가 PUT
router.put('/', )

// 좋아요 취소 DELETE

module.exports = router;