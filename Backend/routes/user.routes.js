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
  resetPassword,
  createUser,
  getAllUsers
} = require("../controllers/user.controllers");

router.post("/user", createUser);
// Middleware

const {
  validateSession,
  validateResetPassword
} = require("../middleware/auth.middleware");

// Routes

router.post("/send-reset-password", sendEmailResetPassword);

router.post("/reset-password", validateResetPassword, resetPassword);

router.post("/login", loginUser);

router.post("/img", createDefaultImage);

router.get("/img", selectDefaultImage);

router.use(validateSession);
router.get("/check-token", checkToken);

router.get("/user", getAllUsers);


module.exports = { userRouter: router };
