// Express

const express = require("express");

const router = express.Router();

// Controllers

const {
  loginUser,
  checkToken,
  createDefaultImage,
  selectDefaultImage
} = require("../controllers/user.controllers");

// Middleware

const { validateSession } = require("../middleware/auth.middleware");

// Routes

router.post("/login", loginUser);

router.get("/check-token", checkToken);

router.post("/create-default-image", createDefaultImage);

router.get("/default-image", selectDefaultImage);

router.use(validateSession);

module.exports = { userRouter: router };
