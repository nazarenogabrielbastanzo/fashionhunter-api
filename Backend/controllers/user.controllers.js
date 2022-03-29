// Import Libreries
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Import Utils
const { catchAsync } = require("../utils/catchAsync");
const { AppError } = require("../utils/AppError");

// Create a Controllers

// Login User

exports.loginUser = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;

  // ITS PENDING TO IMPORT THE MODEL FOR VALIDATE THE FUNCTIONALIBY
  const user = await User.findOne({ username });

  const isPasswordValid = await bcrypt.compare(password, user.password);

  const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });

  if (!user || !isPasswordValid) {
    return next(new AppError(400, "Credentials are invalid"));
  }

  res.status(200).json({
    status: "success",
    data: {
      token
    }
  });
});

// END login User

// Checking the validation of the token

exports.checkToken = catchSync(async (req, res, next) => {
  res.status(200).json({
    status: "success"
  });
});

// END Checking the validation of the token
