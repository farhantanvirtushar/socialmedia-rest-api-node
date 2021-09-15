const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
const helmet = require("helmet");

const userRouter = require("./routes/user.js");
const authRouter = require("./routes/auth.js");
const postRouter = require("./routes/post.js");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database connected!"))
  .catch((err) => console.log(err));

app.use(express.json());
app.use(helmet());
app.use(morgan());

app.use("/api/users/", userRouter);
app.use("/api/auth/", authRouter);
app.use("/api/posts/", postRouter);
app.listen(8000);
