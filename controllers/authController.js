const dotenv = require("dotenv");
const catchAsync = require("../utils/catchAsync");
const AppError = require("./../utils/appError");
const Shubh = require("../models/userModel");
// const jwt = require("jsonwebtoken");

dotenv.config();

const signToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEY, {
    expiresIn: process.env.EXPIRES,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + Number(process.env.EXPIRES_IN) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  // if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  // Remove password from output
  // console.log(user);
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.signup = async (req, res) => {
  try {
    // console.log(req.body);
    const newUser = await Shubh.create({
      name: req.body.name,
      email: req.body.email,

      password: req.body.password,

      // req.body
    });

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

exports.login = catchAsync(async (req, res, next) => {
  // console.log(req.body)
  const { email, password } = req.body;
  if (!email || !password) {
    //so that after the response no other response will send to client
    return res.status(401).json({
      status: "fail",
      message: "Invalid user or password",
    });
  }
  const user = await Shubh.findOne({ email }).select("+password +email");
  // console.log(user);
  if (!user) {
    return res.status(401).json({
      status: "fail",
      message: "Invalid user or password",
    });
  }
  if (user.password === password) {
    res.status(200).json({ status: "success", data: { user } });
  } else {
    res.status(401).json({
      status: "fail",
      message: "Invalid user or password",
    });
  }
});

exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  //Checking if it contain token or not
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  // console.log(token);
  if (!token) {
    return next(new AppError("You are not logged in! Please login first", 401));
  }

  //Verification
  const decoded = jwt.verify(token, process.env.SECRET_KEY);
  // console.log(decoded);
  //Shubh is still a active user
  const freshUser = await Shubh.findById(decoded.id);
  if (!freshUser) {
    return next(
      new AppError("Shubh belonging to this token does no longer exists", 401)
    );
  }

  //Grant access to the user
  // console.log(freshUser);
  req.user = freshUser;
  // console.log("000000000000000000");
  // console.log(req.user);
  next();
});

exports.isLoggedIn = async (req, res, next) => {
  // console.log(req.cookies)
  if (req.cookies.jwt) {
    try {
      // 1) verify token

      const decoded = await jwt.verify(req.cookies.jwt, "mysecretkey");

      // 2) Check if user still exists
      const currentUser = await Shubh.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      // console.log(decoded)
      // THERE IS A LOGGED IN USER
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // console.log(req.user);
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not permission to perform this action", 403)
      );
    }
    next();
  };
};
