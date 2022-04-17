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
  updatePostImg,
  likePost,
  unlikePost,
  addComment,
  deleteComment
} = require("../controllers/post.controllers");

// Middleware
const { validateSession, protectPostOwner } = require("../middleware/auth.middleware");

// Utils
const { upload } = require("../utils/multer");

// Routes
router.use(validateSession);

router.route("/").get(getAllPosts).post(upload.single("postImg"), createPost);

router.get("/userPost/:userId", getPostByUser);

router.patch("/updateImg/:id", protectPostOwner, upload.single("postImg"), updatePostImg);

router
  .route("/:id")
  .get(getPostById)
  .patch(protectPostOwner, updatePost)
  .delete(protectPostOwner, deletePost);

router.route("/like/:id").patch(likePost).delete(unlikePost);

router.route("/comment/:id").post(addComment).delete(deleteComment);

module.exports = { postRouter: router };
