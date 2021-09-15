const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const User = require("../models/User.js");

router.post("/register", async (req, res) => {
  try {
    //   creating password hash
    // console.log(req.body);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = await User({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json("User Not found");
    }
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword) {
      return res.status(500).json("Wrong Password");
    }
    return res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
