// Express

const express = require("express");

const router = express.Router();

// Controllers

const {
  createPost,
  getPosts,
  createDefaultImage,
  selectDefaultImage,
  getAllUsers
} = require("../controllers/post.controllers");



// Routes
router.get("/", getPosts);

router.post("/", createPost);

// router.post("/img", createDefaultImage);

// router.get("/img", selectDefaultImage);

// router.use(validateSession);
// router.get("/check-token", checkToken);

// router.get("/user", getAllUsers);


module.exports = { postRouter: router };
