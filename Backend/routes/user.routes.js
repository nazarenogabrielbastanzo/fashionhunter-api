// Express

const express = require("express");

const router = express.Router();

// Controllers

const {
  loginUser,
  checkToken,
  createDefaultImage,
  selectDefaultImage,
  createUser,
  getAllUsers
} = require("../controllers/user.controllers");

router.post("/user", createUser);
// Middleware

const { validateSession } = require("../middleware/auth.middleware");

// Routes

router.post("/login", loginUser);

router.post("/img", createDefaultImage);

router.get("/img", selectDefaultImage);

router.use(validateSession);
router.get("/check-token", checkToken);

router.get("/user", getAllUsers);


module.exports = { userRouter: router };
