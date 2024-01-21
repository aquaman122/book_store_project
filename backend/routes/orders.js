const express = require("express");
const router = express.Router();
const {orders, getOrders, getOrdersDetail} = require('../controller/orderController');

router.use(express.json());

// 주문 하기
router.post('/', orders)

// 주문 목록 조회
router.get('/', getOrders);

// 주문 상세 상품 조희
router.get('/:id', getOrdersDetail);

module.exports = router;
