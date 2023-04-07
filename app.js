const mongoose = require("mongoose");
const express = require("express");

const cors = require("cors");

const userRouter = require("./routes/userRoutes");

const app = express();

//Middle ware for cors permission
app.use(cors());

//Converting req in json format
app.use(express.json());

//Max 10kb size of input user can give
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

//User Routes
app.use("/api/v1/users", userRouter);

module.exports = app;
