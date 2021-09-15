const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      require: true,
      min: 3,
      max: 20,
      unique: true,
    },
    lastname: {
      type: String,
      require: true,
      min: 3,
      max: 20,
      unique: true,
    },
    username: {
      type: String,
      require: true,
      min: 3,
      max: 20,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    coverPicture: {
      type: String,
      default: "",
    },
    followers: {
      type: Array,
      default: [],
    },
    followings: {
      type: Array,
      default: [],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    currentAddress: {
      country: {
        type: String,
        default: "",
      },
      state: {
        type: String,
        default: "",
      },
      city: {
        type: String,
        default: "",
      },
    },
    phoneNumber: {
      type: String,
      default: "",
    },
    relationship: {
      type: String,
      enum: ["Single", "Married", "Devorceds"],
      default: "Single",
    },
    description: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
