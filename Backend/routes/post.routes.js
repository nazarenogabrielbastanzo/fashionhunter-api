// Express
const express = require("express");
const router = express.Router();

// Controllers
const { createPost, getAllPosts } = require("../controllers/post.controllers");

// Middleware
const { validateSession } = require("../middleware/auth.middleware");

// Utils
const { upload } = require("../utils/multer");

// Routes
router.use(validateSession);

router.route("/").get(getAllPosts).post(upload.single("postImg"), createPost);

module.exports = { postRouter: router };
