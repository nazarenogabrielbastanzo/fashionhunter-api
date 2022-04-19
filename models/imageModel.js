const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
  imageDefault: {
    type: String,
    required: true
  }
});

const Image = mongoose.model("Image", ImageSchema);

module.exports = Image;
