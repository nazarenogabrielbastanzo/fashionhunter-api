// Import Libraries
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { storage } = require("../utils/firebase");
const { ref, uploadBytes, getDownloadURL } = require("firebase/storage");

// Import Utils
const { catchAsync } = require("../utils/catchAsync");
const { AppError } = require("../utils/AppError");
const { Email } = require("../utils/email");
const { promisify } = require("util");

// Import Models
const User = require("../models/userModel");
const Image = require("../models/imageModel");
const { json } = require("express");

// Login User
exports.loginUser = catchAsync(async (req, res, next) => {
  try {
    const { username, password } = req.body;
    console.log({ username, password });
    const user = await User.findOne({ username });
    const isPasswordValid = await bcrypt.compare(password, user.password);

    const token = jwt.sign({ username: username }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });

    if (!user || !isPasswordValid) {
      return next(new AppError(400, "Credentials are invalid"));
    }

    res.status(200).json({
      status: "success",
      userId: user._id,
      token
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "User not found on the database"
    });
  }
});

// Create default image picture
exports.createDefaultImage = catchAsync(async (req, res, next) => {
  const imgRef = ref(storage, `defaultImagePicture/${req.file.originalname}`);

  const result = await uploadBytes(imgRef, req.file.buffer);

  const newImageDefault = await Image.create({
    imageDefault: result.metadata.fullPath
  });

  res.status(201).json({
    status: "success",
    data: {
      imageDefault: newImageDefault
    }
  });
});

// Select default image picture
exports.selectDefaultImage = catchAsync(async (req, res, next) => {
  const img = await Image.find();

  const imgsPromises = img.map(async ({ _id, imageDefault }) => {
    const imgRef = ref(storage, imageDefault);

    const imgDownloadUrl = await getDownloadURL(imgRef);

    return { _id, img: imgDownloadUrl };
  });

  const resolvedImg = await Promise.all(imgsPromises);

  res.status(200).json({
    status: "success",
    data: {
      img: resolvedImg
    }
  });
});

// Create User
exports.createUser = catchAsync(async (req, res, next) => {
  const { firstName, lastName, username, email, password, passwordConfirm } = req.body;

  const imgRef = ref(storage, `imgs-${username}/${Date.now()}-${req.file.originalname}`);

  const result = await uploadBytes(imgRef, req.file.buffer);

  const user = await User.create({
    firstName,
    lastName,
    username,
    email,
    password,
    passwordConfirm,
    img: result.metadata.fullPath
  });

  user.password = undefined;
  user.passwordConfirm = undefined;

  res.status(201).json({
    status: "success",
    data: {
      user
    }
  });
});

// Send email to reset the password
exports.sendEmailResetPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return next(new AppError(400, "Credentials are invalid"));
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN_TOKEN
  });

  await new Email(email)
    .sendWelcome(token)
    .then(() => {
      res.status(200).json({
        status: "success",
        message: "Email sent successfully",
        token
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

// Reset the password
exports.resetPassword = catchAsync(async (req, res, next) => {
  const { password, passwordConfirm } = req.body;

  const { token } = req.params;

  const decodedToken = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const userId = decodedToken.id;

  const salt = await bcrypt.genSalt(12);

  const hashedPassword = await bcrypt.hash(password, salt);

  const hashedPasswordConfirm = await bcrypt.hash(passwordConfirm, salt);

  if (password !== passwordConfirm) {
    return next(new AppError(400, "The passwords are differents"));
  }
  const updateUser = await User.findByIdAndUpdate(userId, {
    password: hashedPassword,
    passwordConfirm: hashedPasswordConfirm,
    passwordChangedAt: Date.now()
  }).select("-password");

  res.status(200).json({
    status: "success",
    data: {
      updateUser
    }
  });
});

// Get All Users
// IMPORTANT: this endpoint will be used for the admin only
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find().select("-password");

  const usersPromises = users.map(
    async ({ _id, firstName, lastName, username, email, role, img }) => {
      const imgRef = ref(storage, img);

      const imgDownloadUrl = await getDownloadURL(imgRef);

      return { _id, firstName, lastName, username, email, role, img: imgDownloadUrl };
    }
  );

  const resolvedUsers = await Promise.all(usersPromises);

  res.status(200).json({
    status: "success",
    data: {
      length: resolvedUsers.length,
      users: resolvedUsers
    }
  });
});

// Get User by ID
exports.getUserById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findById(id).select("-password");

  if (!user) {
    return next(new AppError(400, "User not found"));
  }

  const imgRef = ref(storage, user.img);

  const imgDownloadUrl = await getDownloadURL(imgRef);

  user.img = imgDownloadUrl;

  res.status(200).json({
    status: "success",
    data: {
      user
    }
  });
});
