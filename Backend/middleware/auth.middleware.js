// Import Libreries
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { promisify } = require("util");

// Import Utils
const { AppError } = require("../utils/AppError");
const { catchAsync } = require("../utils/catchAsync");

// Init dotenv
dotenv.config({ path: "./config.env" });

// Import model
const User = require("../models/userModel");

exports.validateSession = catchAsync(async (req, res, next) => {
  let token;

  const { authorization } = req.headers;

  if (authorization && authorization.startsWith("Bearer")) {
    token = authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError(401, "Invalid session"));
  }

  // Return the token, no a boolean
  const decodedToken = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const user = await User.findOne({ username: decodedToken.username }).select(
    "-password"
  );

  if (!user) {
    return next(new AppError(401, "This user is no longer available"));
  }

  // // Create a property in a request object for using in another controllers
  req.currentUser = user;

  next();
});
