const dotenv = require("dotenv");
// const catchAsync = require("./../utils/catchAsync");
const Shubh = require("../models/userModel");

exports.changePassword = async (req, res) => {
  try {
    // console.log(req.body);
    const newUser = await Shubh.findOneAndUpdate(
      {
        email: req.body.email,
      },
      {
        password: req.body.password,
      }
    );

    res.json({
      status: "sucess",
      data: newUser,
    });
  } catch (err) {
    res.status(401).json({
      error: err,
    });
  }
};
exports.userPass = async (req, res) => {
  try {
    // console.log(req.body);
    const newUser = await Shubh.findOne({
      email: "user1@gmail.com",
    }).select("+password");
    // console.log(newUser);
    res.json({
      status: "sucess",
      password: newUser.password,
    });
  } catch (err) {
    res.status(401).json({
      error: err,
    });
  }
};
