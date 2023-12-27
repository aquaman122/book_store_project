const express = require("express");
const app = express();
require("dotenv").config();

app.listen(process.env.PORT);

const userRouter = require('./routes/users');
const bookRouter = require('./routes/books');

app.use("/", userRouter);
app.use("/", bookRouter);
