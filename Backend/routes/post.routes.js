// Express

const express = require("express");
const router = express.Router();


// Controllers
const {
  createPost,
  getAllPosts,
  createDefaultImage,
  selectDefaultImage,
  getAllUsers
} = require("../controllers/post.controllers");

// Middleware
const {
  validateSession
} = require("../middleware/auth.middleware");

// Routes
//router.post("/img", createDefaultImage);

//router.get("/img", selectDefaultImage);

//router.use(validateSession);

router.get("/", getAllPosts);

//router.get("/:id", getPostToId)

router.post("/", createPost);


module.exports = { postRouter: router };
