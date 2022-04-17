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
const Post = require("../models/postModel");

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

  // Create a property in a request object for using in another controllers
  req.currentUser = user;

  next();
});

exports.protectAccountOwner = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const { currentUser } = req;

  const user = JSON.stringify(currentUser._id);

  const userId = user.slice(1, user.lastIndexOf('"'));

  if (userId !== id) {
    return next(new AppError(403, "You cant update others users accounts"));
  }

  next();
});

exports.protectPostOwner = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = req.currentUser;

  const post = await Post.findById(id);

  if (!post) {
    return next(new AppError(401, "I cant find the post with the given Id"));
  }

  if (post.postedBy[0].userId !== user.id) {
    return next(new AppError(401, "You are not authorized to update this post"));
  }

  next();
});
