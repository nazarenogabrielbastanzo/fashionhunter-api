const express = require("express");
const router = express.Router();

const {
  createPost,
  getPostByUser,
  getPostById
} = require("../controllers/post.controllers");

const { validateSession } = require("../middleware/auth.middleware");

router.use(validateSession);

router
  .route("/")
  .post(validateSession, createPost)
  .get(validateSession, getPostByUser)
  .get(validateSession, getPostById);

module.exports = { postRouter: router };