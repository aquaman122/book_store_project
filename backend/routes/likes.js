const express = require("express");
const router = express.Router();
// connection mariadb module
const conn = require('../mariadb');

const {addLike, removeLike} = require('../controller/likeController');

// 좋아요 추가 
router.post('/:id', addLike)

// 좋아요 취소 DELETE
router.delete('/:id', removeLike);

module.exports = router;