const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  postedBy: [
    {
      userId: {
        type: String
      },
      fullName: {
        type: String
      },
      profilePic: {
        type: String
      },
      _id: false
    }
  ],
  image: {
    type: String,
    required: true
  },
  description: {
    type: String,
    max: 150
  },
  numLikes: {
    type: Number,
    default: 0
  },
  likes: [
    {
      userId: {
        type: String
      },
      username: {
        type: String
      },
      likedAt: {
        type: Date,
        default: Date.now()
      }
    }
  ],
  numComments: {
    type: Number,
    default: 0
  },
  comments: [
    {
      text: {
        type: String,
        required: true
      },
      created: {
        type: Date,
        default: Date.now()
      },
      postedBy: {
        type: String,
        ref: "User"
      }
    }
  ],
  active: {
    type: Boolean,
    default: true,
    select: false
  },
  created: {
    type: Date,
    default: Date.now
  }
});

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
