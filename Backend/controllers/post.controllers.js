// Import Libraries
const { storage } = require("../utils/firebase");
const { ref, uploadBytes, getDownloadURL } = require("firebase/storage");

// Import Utils
const { catchAsync } = require("../utils/catchAsync");
const { AppError } = require("../utils/AppError");
const { filterObj } = require("../utils/filterObj");

// Import Models
const Post = require("../models/postModel");

//  Create post
exports.createPost = catchAsync(async (req, res, next) => {
  try {
    const { description } = req.body;

    const user = req.currentUser;

    const imgRef = ref(
      storage,
      `imgs-${user.username}/posts/${Date.now()}-${req.file.originalname}`
    );

    const result = await uploadBytes(imgRef, req.file.buffer);

    const createPost = await Post.create({
      userId: user._id,
      description,
      image: result.metadata.fullPath
    });

    res.status(201).json({
      status: "success",
      data: {
        createPost
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).send(error);
  }
});

// Get all posts
exports.getAllPosts = catchAsync(async (req, res, next) => {
  try {
    const posts = await Post.find({ active: true });

    const postPromises = posts.map(
      async ({ _id, userId, image, description, likes, comments, created }) => {
        const imgRef = ref(storage, image);

        const imgDownloadUrl = await getDownloadURL(imgRef);

        return {
          _id,
          userId,
          image: imgDownloadUrl,
          description,
          likes,
          comments,
          created
        };
      }
    );

    const resolvedPost = await Promise.all(postPromises);

    if (posts.length > 0) {
      res.status(200).json({
        status: "success",
        length: resolvedPost.length,
        data: {
          resolvedPost
        }
      });
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

// Get post by id
exports.getPostById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const post = await Post.findById(id);

  if (!post) {
    return next(new AppError(404, "I cant find the post with the given ID"));
  }

  const imgRef = ref(storage, post.image);

  const imgDownloadUrl = await getDownloadURL(imgRef);

  post.image = imgDownloadUrl;

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

  const post = await Post.find({ username, active: true });

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

// Update the post
exports.updatePost = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const data = filterObj(req.body, "description");

  const postUpdate = await Post.findByIdAndUpdate(id, { ...data });

  if (!postUpdate) {
    return next(new AppError(404, "I cant find the post with the given ID"));
  }

  res.status(204).json({
    status: "success"
  });
});

// Update the image post
exports.updatePostImg = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = req.currentUser;

  const imgRef = ref(
    storage,
    `imgs-${user.username}/posts/${Date.now()}-${req.file.originalname}`
  );

  const result = await uploadBytes(imgRef, req.file.buffer);

  const postImgUpdate = await Post.findByIdAndUpdate(id, {
    image: result.metadata.fullPath
  });

  if (!postImgUpdate) {
    return next(new AppError(404, "I cant find the post with the given ID"));
  }

  res.status(204).json({
    status: "success"
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
