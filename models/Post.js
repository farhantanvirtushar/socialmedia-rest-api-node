const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    userID: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
      max: 1000,
    },
    image: {
      type: String,
      default: "",
    },
    likes: {
      type: Array,
      default: [],
    },
    comments: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
