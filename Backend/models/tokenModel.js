const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 10 // 1hour
  }
});

tokenSchema.index({createdAt: 1}, {expireAfterSeconds: 10});

module.exports = mongoose.model("Token", tokenSchema);
