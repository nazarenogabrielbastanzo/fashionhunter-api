// Import Libraries
const { storage } = require("../utils/firebase");
const { ref, uploadBytes, getDownloadURL } = require("firebase/storage");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

// Import Utils
const { catchAsync } = require("../utils/catchAsync");
const { AppError } = require("../utils/AppError");
const { filterObj } = require("../utils/filterObj");

// Import Models
const Post = require("../models/postModel");
const User = require("../models/userModel");

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

    const fullName = user.firstName + " " + user.lastName;
    profileUserPic = await User.findById(user._id);

    const createPost = await Post.create({
      postedBy: {
        userId: user._id,
        fullName,
        profilePic: profileUserPic.img
      },
      description,
      image: result.metadata.fullPath
    });

    res.status(201).json({
      status: "success",
      createPost
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
      async ({ _id, postedBy, image, description, numLikes, numComments, created }) => {
        const imgRef = ref(storage, image);
        const imgDownloadUrl = await getDownloadURL(imgRef);
        return {
          _id,
          postedBy,
          image: imgDownloadUrl,
          description,
          numLikes,
          numComments,
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

  // const post = await Post.findById(id);

  const post = await Post.aggregate([{ $match: { _id: ObjectId(id), active: true } }]);

  const postFilter = post[0];

  if (!post) {
    return next(new AppError(404, "I cant find the post with the given ID"));
  }

  const imgRef = ref(storage, postFilter.image);

  const imgDownloadUrl = await getDownloadURL(imgRef);

  postFilter.image = imgDownloadUrl;

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

// Like the post
exports.likePost = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = req.currentUser;

  const post = await Post.findById(id);

  if (!post) {
    return next(new AppError(404, "I cant find the post with the given ID"));
  }

  const userLiked = post.likes.find((like) => like.username === user.username);

  if (userLiked) {
    return next(new AppError(400, "You already liked this post"));
  }

  post.likes.push({ userId: user._id, username: user.username });
  post.numLikes++;

  await post.save();

  res.status(200).json({
    status: "success",
    data: {
      post
    }
  });
});

// Unlike the post
exports.unlikePost = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = req.currentUser;

  const post = await Post.findById(id);

  if (!post) {
    return next(new AppError(404, "I cant find the post with the given ID"));
  }

  const userLiked = post.likes.find((like) => like.username === user.username);

  if (!userLiked) {
    return next(new AppError(400, "You have not liked this post"));
  }

  post.likes = post.likes.filter((like) => like.username !== user.username);
  post.numLikes--;

  await post.save();

  res.status(200).json({
    status: "success",
    data: {
      post
    }
  });
});

// Add comment
exports.addComment = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = req.currentUser;

  const post = await Post.findById(id);

  if (!post) {
    return next(new AppError(404, "I cant find the post with the given ID"));
  }

  post.comments.push({
    text: req.body.text,
    postedBy: user.username
  });
  post.numComments++;

  await post.save();

  res.status(200).json({
    status: "success",
    data: {
      post
    }
  });
});

// Delete comments
exports.deleteComment = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = req.currentUser;

  const post = await Post.findById(id);

  if (!post) {
    return next(new AppError(404, "I cant find the post with the given ID"));
  }

  const comment = post.comments.find((comment) => comment.id === req.body.commentId);

  if (!comment) {
    return next(new AppError(404, "I cant find the comment with the given ID"));
  }

  if (comment.postedBy !== user.username) {
    return next(new AppError(401, "You are not authorized to delete this comment"));
  }

  post.comments = post.comments.filter((comment) => comment.id !== req.body.commentId);
  post.numComments--;

  await post.save();

  res.status(200).json({
    status: "success",
    data: {
      post
    }
  });
});
