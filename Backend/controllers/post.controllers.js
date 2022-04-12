// Import Libraries

const { storage } = require("../utils/firebase");
const { ref, uploadBytes, getDownloadURL } = require("firebase/storage");

// Import Utils
const { catchAsync } = require("../utils/catchAsync");
const { AppError } = require("../utils/AppError");
const { filterObj } = require("../utils/filterObj");

// Import Models
const Post = require("../models/postModel");
const User = require("../models/userModel");

// User Controllers
const { getAllUsers } = require("../controllers/user.controllers");

//  Create post
exports.createPost = catchAsync(async (req, res) => {
  const { description } = req.body;

  const user = req.currentUser;

  console.log("CurrentUser:__", user);

  const imgRef = ref(
    storage,
    `imgs-${user.username}/posts/${Date.now()}-${req.file.orginalname}`
  );

  const result = await uploadBytes(imgRef, req.file.buffer);

  try {
    const createPost = await Post.create({
      userId: user._id,
      image: result.metadata.fullPath,
      description
    });
    console.log("CreaPost?:__", createPost);
    res.status(201).json({
      status: "success",
      msg: "Post created",
      data: { createPost }
    });
  } catch (err) {
    console.log(err);
    res.status(500).send(error);
  }
});

// Get all posts
exports.getAllPosts = catchAsync(async (req, res) => {
  try {
    const posts = await Post.find({});

    if (posts.length > 0) {
      res.status(200).send(posts);
    } else {
      res.status(400).json({
        ok: false,
        msg: "No Posts"
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// Update the post
exports.updatePost = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const data = filterObj(req.body, "title", "content");

  const postUpdate = await Post.findByIdAndUpdate(id, { ...data });

  if (!postUpdate) {
    return next(new AppError(404, "I cant find the post with the given ID"));
  }

  res.status(201).json({
    status: "success",
    data: {
      postUpdate
    }
  });
});

// Update the image post
exports.updatePostImg = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const imgRef = ref(storage, `posts-${username}/${Date.now()}-${req.file.originalname}`);

  const result = await uploadBytes(imgRef, req.file.buffer);

  // It's pending to import the model and try the functionability
  const postImgUpdate = await Post.findByIdAndUpdate(id, { img: result });

  if (!postImgUpdate) {
    return next(new AppError(404, "I cant find the post with the given ID"));
  }

  res.status(201).json({
    status: "success",
    data: {
      postImgUpdate
    }
  });
});

// Delete the post
exports.deletePost = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // This is a soft delete technical
  const postUpdate = await Post.findByIdAndUpdate(id, { active: false });

  if (!postUpdate) {
    return next(new AppError(404, "I cant find the post with the given ID"));
  }

  res.status(204).json({
    status: "success"
  });
});

// Get post by id
exports.getPostById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const post = await Post.findById(id);

  if (!post) {
    return next(new AppError(404, "I cant find the post with the given ID"));
  }

  res.status(200).json({
    status: "success",
    data: {
      post
    }
  });
});

// Get post by user
exports.getPostByUser = catchAsync(async (req, res, next) => {
  const { username } = req.params;

  // It's pending to import the model
  const post = await Post.find({ username });

  if (!post) {
    return next(new AppError(404, "I cant find the post with the given username"));
  }

  res.status(200).json({
    status: "success",
    data: {
      post
    }
  });
});
