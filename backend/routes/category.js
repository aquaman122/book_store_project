const express = require("express");
const router = express.Router();
const { allCategory } = require('../controller/categoryController');

router.get('/', allCategory);

module.exports = router
