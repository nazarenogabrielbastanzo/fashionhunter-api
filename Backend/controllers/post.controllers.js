// const { storage } = require("../database/firebase");
// const { ref, uploadBytes, getDownloadURL } = require("firebase/storage");

// Import Utils
const { catchAsync } = require("../utils/catchAsync");
const { AppError } = require("../utils/AppError");

// Import Models
const Post = require("../models/postModel");
const User = require("../models/userModel");

//create post
exports.createPost = catchAsync(async (req, res) => {
  const { userId, image, description } = req.body;

  try {
    const users = await User.getAllUsers()
    const createPost = await Post.create(userId, image, description);
  console.log("CreaPost?:__", createPost);
  //   if (!createPost) {
  //     return next(new AppError(400, "Credentials are invalid"));
  //   }
  // status code 201  if all goes well, return ok: true
  res.status(201).json({
    status: "success",
    msg: "Post created"
  });} catch (err){
    console.log(err)
    res.status(500).send(error)
  }
});

//get posts
exports.getPosts = catchAsync(async (req, res) => {
    
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
    // .json({
    //   ok: false,
    //   msg: "An error has arisen in the process, please review"
    // });
  }
});

//get post to id
exports.getPostToId = catchAsync(async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.find({_id: id});
    console.log(post[0]);
    if (post[0]) {
      const {
        id: idDB,
        userid: useridDB,
        username: usernameDB,
        avatar: avatarDB,
        title: titleDB,
        description: descriptionDB,
        image: imageDB,
        posted: postedDB,
        likes: likesDB
      } = post[0];

      res.status(200).json({
        id: idDB,
        user: {
          userid: useridDB,
          username: usernameDB,
          avatar: avatarDB
        },
        title: titleDB,
        description: descriptionDB,
        image: imageDB,
        posted: postedDB,
        likes: likesDB
      });
    } else {
      res.status(404).json({
        ok: false,
        msg: "Post not found"
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "An error has arisen in the process, please review"
    });
  }
});

//get all posts to user
exports.getAllPostToUserId = catchAsync(async (req, res) => {
  const { userid } = req.params;

  try {
    const sqlMakePost = `SELECT  P.id, P.userid, U.username, U.avatar, P.title, P.description, P.image, P.posted, P.likes FROM posts as P INNER JOIN users as U WHERE  P.userid = '${userid}' && P.userid=U.id`;
    const post = await db.query(sqlMakePost);
    console.log(post);
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({
        ok: false,
        msg: "Post not found"
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "An error has arisen in the process, please review"
    });
  }
});

//edite post
exports.editPost = catchAsync(async (req, res) => {
  const { id } = req.params;

  try {
    // query to mysql DB
    const sqlMakePost = `SELECT * FROM posts WHERE id = '${id}'`;
    const post = await db.query(sqlMakePost);
    console.log(post[0]);

    // data from mysql DB
    const { title: titleDB, description: descriptionDB } = post[0];

    // data from require body
    const { title, description } = req.body;

    if (post[0]) {
      const updatedPosttoDB = {
        title: title || titleDB,
        description: description || descriptionDB
      };

      await db.query("UPDATE posts set ? WHERE id = ?", [updatedPosttoDB, id]);
      res.status(201).json({
        ok: true,
        msg: "Post updated successfully"
      });
    } else {
      res.status(404).json({
        ok: false,
        msg: "Post not found"
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "An error has arisen in the process, please review"
    });
  }
});

// update likes
exports.likesPost = catchAsync(async (req, res) => {
  const { id } = req.params;

  try {
    // query to mysql DB
    const sqlMakePost = `SELECT * FROM posts WHERE id = '${id}'`;
    const post = await db.query(sqlMakePost);

    // data from mysql DB
    const { likes: likesDB } = post[0];

    // data from require body
    const { likes } = req.body;

    if (post[0]) {
      const updatedPosttoDB = {
        likes: likes || likesDB
      };

      await db.query("UPDATE posts set ? WHERE id = ?", [updatedPosttoDB, id]);
      res.status(201).json({
        ok: true,
        msg: "Post updated successfully"
      });
    } else {
      res.status(404).json({
        ok: false,
        msg: "Post not found"
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "An error has arisen in the process, please review"
    });
  }
});

//delete post
exports.deletePost = catchAsync(async (req, res) => {
  try {
    const { id } = req.params;

    // select query
    const sqlMakePost_select = `SELECT * FROM posts WHERE id = '${id}'`;
    const post = await db.query(sqlMakePost_select);

    // delete query
    const sqlMakeUser_delete = `DELETE FROM posts WHERE id = '${id}'`;
    console.log(post);
    if (post[0]) {
      await db.query(sqlMakeUser_delete);
      res.status(201).json({
        ok: true,
        msg: "Post removed successfully"
      });
    } else {
      res.status(404).json({
        ok: false,
        msg: "Post not exist"
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "An error has arisen in the process, please review"
    });
  }
});
