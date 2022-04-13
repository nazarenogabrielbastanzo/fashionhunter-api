// Express
const express = require("express");
const router = express.Router();

// Controllers
const {
  createPost,
  getAllPosts,
  deletePost,
  getPostById,
  getPostByUser,
  updatePost,
  updatePostImg
} = require("../controllers/post.controllers");

// Middleware
const { validateSession } = require("../middleware/auth.middleware");

// Utils
const { upload } = require("../utils/multer");

// Routes
router.use(validateSession);

router.route("/").get(getAllPosts).post(upload.single("postImg"), createPost);

router.patch("/updateImg/:id", upload.single("postImg"), updatePostImg);

router.get("/userPost/:id", getPostByUser);

router.route("/:id").get(getPostById).patch(updatePost).patch().delete(deletePost);

module.exports = { postRouter: router };
