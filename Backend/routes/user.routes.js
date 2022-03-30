// Express

const express = require("express");

const router = express.Router();

// Controllers

const {
  loginUser,
  checkToken,
  createDefaultImage,
  selectDefaultImage,
  sendEmailResetPassword,
  resetPassword
} = require("../controllers/user.controllers");

// Middleware

const {
  validateSession,
  validateResetPassword
} = require("../middleware/auth.middleware");

// Routes

router.post("/send-reset-password", sendEmailResetPassword);

router.post("/reset-password", validateResetPassword, resetPassword);

router.post("/login", loginUser);

router.get("/check-token", checkToken);

router.post("/create-default-image", createDefaultImage);

router.get("/default-image", selectDefaultImage);

router.use(validateSession);

module.exports = { userRouter: router };
