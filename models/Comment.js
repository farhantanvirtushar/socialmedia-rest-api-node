const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
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
    likes: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);
