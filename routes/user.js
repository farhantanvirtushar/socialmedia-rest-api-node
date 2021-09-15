const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

router.put("/:id", async (req, res) => {
  if (req.body.userID == req.params.id || req.body.isAdmin) {
    if (req.body.passowrd) {
      try {
        //   creating password hash
        const salt = await bcrypt.genSalt(10);
        req.body.passowrd = await bcrypt.hash(req.body.password, salt);
      } catch (error) {
        return res.status(500).json(error);
      }
    }

    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });

      if (!user) {
        return res.status(404).json("user not found");
      }
    } catch (error) {
      return res.status(500).json(error);
    }

    return res.status(200).json("Update successful");
  } else {
    return res.status(403).json("You can update only your account");
  }
});

router.delete("/:id", async (req, res) => {
  if (req.body.userID == req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
    } catch (error) {
      return res.status(500).json(error);
    }

    return res.status(200).json("Acount Deleted");
  } else {
    return res.status(403).json("You can delete only your account");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, updatedAt, ...other } = user._doc;
    return res.status(200).json(other);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/people/discover", async (req, res) => {
  try {
    const users = await User.aggregate([
      {
        $project: {
          _id: "$_id",
          firstname: "$firstname",
          lastname: "$lastname",
          followers_count: { $size: "$followers" },
        },
      },
      {
        $sort: { followers_count: 1 },
      },
      {
        $limit: 10,
      },
    ]);

    return res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
});
router.put("/:id/follow", async (req, res) => {
  if (req.body.userID != req.params.id) {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.body.userID);

    if (!userToFollow.followers.includes(req.body.userID)) {
      await userToFollow.updateOne({ $push: { followers: req.body.userID } });
      await currentUser.updateOne({ $push: { followings: req.params.id } });

      res.status(200).json("followed");
    } else {
      res.status(500).json("already follow this user");
    }
  } else {
    return res.status(500).json("can not follow yourself");
  }
});

router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userID != req.params.id) {
    const userToUnfollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.body.userID);
    if (userToUnfollow.followers.includes(req.body.userID)) {
      await userToUnfollow.updateOne({ $pull: { followers: req.body.userID } });
      await currentUser.updateOne({ $pull: { followings: req.params.id } });

      res.status(200).json("unfollowed");
    } else {
      res.status(500).json("not following this user");
    }
  } else {
    return res.status(500).json("can not unfollow yourself");
  }
});
module.exports = router;
