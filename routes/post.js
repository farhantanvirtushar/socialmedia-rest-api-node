const express = require("express");
const Post = require("../models/Post");
const Commentt = require("../models/Comment");
const User = require("../models/User");
const router = express.Router();

router.post("/", async (req, res) => {
  const newPost = new Post(req.body);

  try {
    const post = await newPost.save();
    if (post) {
      return res.status(200).json("post created successfully");
    } else {
      return res.status(500).json("error creating post");
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post) {
      return res.status(200).json(post);
    }
    return res.status(404).json("cannot show post");
  } catch (error) {
    return res.status(500).json(error);
  }
});
router.get("comments/:id", async (req, res) => {
  try {
    const post = await Comment.findById(req.params.id);
    if (post) {
      return res.status(200).json(post);
    }
    return res.status(404).json("cannot show comment");
  } catch (error) {
    return res.status(500).json(error);
  }
});
router.post(":id/comment", async (req, res) => {
  const newComment = new Comment(req.body);
  const post = Post.findById(req.params.id);

  try {
    const comment = await newComment.save();
    await post.updateOne({ $push: { comments: post._id } });
    if (comment) {
      return res.status(200).json("comment created successfully");
    } else {
      return res.status(500).json("error creating comment");
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});
router.get("/people/:userID", async (req, res) => {
  try {
    const post = await Post.find({ userID: req.params.userID }).sort({
      createdAt: -1,
    });
    if (post) {
      return res.status(200).json(post);
    }
    return res.status(404).json("cannot show post");
  } catch (error) {
    return res.status(500).json(error);
  }
});
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(500).json("post was not found");
    }
    if (post.userID == req.body.userID) {
      await post.updateOne({ $set: req.body });
      return res.status(200).json("post updated successfully");
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(500).json("post was not found");
    }
    if (post.userID == req.body.userID) {
      await post.deleteOne();
      return res.status(200).json("post deleted successfully");
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(500).json("post was not found");
    }
    if (!post.likes.includes(req.body.userID)) {
      await post.updateOne({ $push: { likes: req.body.userID } });
      return res.status(200).json("liked");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userID } });
      return res.status(200).json("unliked");
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.get("/timeline/:userID", async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userID);
    const currentUserPost = await Post.find({ userID: req.params.userID });

    const friendPost = await Promise.all(
      currentUser.followings.map((friendID) => {
        return Post.find({ userID: friendID });
      })
    );

    return res.status(200).json(currentUserPost.concat(...friendPost));
  } catch (error) {
    // console.log(error);
    return res.status(500).json(error);
  }
});
module.exports = router;
