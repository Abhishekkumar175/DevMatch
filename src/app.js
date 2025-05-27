require("dotenv").config();
const express = require('express');
const connectDB = require('./config/database');
const app= express();
const cors = require("cors");
const http = require("http");

const cookieParser = require("cookie-parser");


app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);



connectDB()
  .then(()=> {
    console.log('MongoDB connected...');
    app.listen(process.env.PORT || 7777, () => {
      console.log('Server is running on port 7777....');
    });
  })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    }); 
 

