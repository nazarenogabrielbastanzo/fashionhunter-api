const { storage } = require("../utils/firebase");
const { ref, uploadBytes, getDownloadURL } = require("firebase/storage");

// Import Utils
const { catchAsync } = require("../utils/catchAsync");
const { AppError } = require("../utils/AppError");

// Import Models
const Post = require("../models/postModel");
const User = require("../models/userModel");

// User Controllers
const {
  getAllUsers
} = require("../controllers/user.controllers");

//create post
exports.createPost = catchAsync(async (req, res) => {

  const { description } = req.body;

  const user = req.currentUser
  console.log("CurrentUser:__", user)
  
  const imgRef = ref(storage, `imgs-${user}/${Date.now()}-${req.file.user}`);
  const result = await uploadBytes(imgRef, req.file.buffer)

  try {
    const createPost = await Post.create({
      userId: user,
      image: result.metadata.fullPath,
      description
    });
    console.log("CreaPost?:__", createPost);
    res.status(201).json({
    status: "success",
    msg: "Post created"
  });} catch (err){
    console.log(err)
    res.status(500).send(error)
  }
});

//get posts
exports.getAllPosts = catchAsync(async (req, res) => {
    
    try {
      const posts = await Post.find({});
      console.log(posts);
    
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
    res.status(500).send(error)
  }
});
