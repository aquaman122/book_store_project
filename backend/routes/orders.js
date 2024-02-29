const express = require("express");
const router = express.Router();
const {orders, getOrders, getOrdersDetail, deleteOrder } = require('../controller/orderController');
const { verifyToken } = require('../middleware/ensureAuthorization');

router.use(express.json());

// 주문 하기
router.post('/', verifyToken,  orders)

// 주문 목록 조회
router.get('/', verifyToken, getOrders);

// 주문 상세 상품 조희
router.get('/:id', verifyToken, getOrdersDetail);
router.delete('/:id', verifyToken, deleteOrder);

module.exports = router;
