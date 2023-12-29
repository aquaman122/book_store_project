const express = require("express");
const app = express();
require("dotenv").config();

app.listen(process.env.PORT);

const userRouter = require('./routes/users');
const bookRouter = require('./routes/books');
const likeRouter = require('./routes/likes');
const cartRouter = require('./routes/carts');
const orderRouter = require('./routes/orders');

app.use("/", userRouter);
app.use("/", bookRouter);
app.use("/", likeRouter);
app.use("/", cartRouter);
app.use("/", orderRouter);
