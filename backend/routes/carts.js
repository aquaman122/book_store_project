const express = require("express");
const router = express.Router();
const { addToCart, getCartItems, removeCartItems } = require('../controller/cartController');
const { verifyToken } = require("../middleware/ensureAuthorization");

// 장바구니 담기 POST 201
router.post('/', verifyToken, addToCart)
// 장바구니 조회 200 // 장바구니 예상 상품 목록 조회
router.get('/', verifyToken, getCartItems);
// 장바구니 제거 200
router.delete('/:id', verifyToken, removeCartItems);

module.exports = router;