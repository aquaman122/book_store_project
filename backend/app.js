const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const { verifyToken, verifyTokenOptional } = require("./middleware/ensureAuthorization");
const app = express();
require("dotenv").config();
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(cookieParser());
app.use(verifyTokenOptional),
app.use(verifyToken);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const userRouter = require('./routes/users');
const bookRouter = require('./routes/books');
const categoryRouter = require('./routes/category');
const cartRouter = require('./routes/carts');
const likeRouter = require('./routes/likes');
const orderRouter = require('./routes/orders');

app.use("/users", userRouter);
app.use("/books", bookRouter);
app.use("/category", categoryRouter);
app.use("/carts", cartRouter);
app.use("/likes", likeRouter);
app.use("/orders", orderRouter);
