const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  description: {
    type: String,
    max: 150
  },
  likes: {
    type: Array,
    default: []
  },
  comments: [
    {
      text: {
        type: String,
        required: true
      },
      created: {
        type: Date,
        default: Date.now
      },
      postedBy: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
      }
    }
  ],
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
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
