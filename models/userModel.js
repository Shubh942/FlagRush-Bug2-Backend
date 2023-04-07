const mongoose = require("mongoose");
// const validator = require("validator");

const shubhSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name"],

    maxlength: 20,
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide your password"],
    minlength: 8,
    select: false,
  },
  email: {
    type: String,
    required: [true, "Please provide us your Email"],
    unique: true,
    lowercase: true,
    // validate: [validator.isEmail, "Please provide valid Email"],
  },
});

const Shubh = mongoose.model("Shubh", shubhSchema);
module.exports = Shubh;
