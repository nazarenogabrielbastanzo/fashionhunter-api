// Express

const express = require("express");

const router = express.Router();

// Controllers

const { loginUser, checkToken } = require("../controllers/user.controllers");

// Middleware

const { validateSession } = require("../middleware/auth.middleware");

// Routes

router.post("/login", loginUser);

router.get("/check-token", checkToken);

router.use(validateSession);

module.exports = { userRouter: router };
