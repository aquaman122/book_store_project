const express = require("express");
const router = express.Router();
// connection mariadb module
const conn = require('../mariadb');

// JWT module
const jwt = require('jsonwebtoken');

// dotenv module and declear
const dotEnv = require("dotenv");
dotEnv.config();

router.use(express.json());


module.exports = router;