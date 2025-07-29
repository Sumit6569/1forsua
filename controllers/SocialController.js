const SociaModel = require("../models/SociaModel");
const mongoose = require("mongoose");
const path = require("path");

// Create a new social post with optional image
const createPost = async (req, res) => {
  try {
    const { user, text } = req.body;

    // Validate required fields
    if (!user || !text) {
      return res.status(400).json({
        message: "User ID and text are required",
      });
    }

    // Validate user ID format
    if (!mongoose.Types.ObjectId.isValid(user)) {
      return res.status(400).json({
        message: "Invalid user ID format",
      });
    }

    // Prepare post data
    const postData = { user, text };

    // Add image if uploaded
    if (req.file) {
      postData.image = `/uploads/${req.file.filename}`;
    }

    // Create the post
    const newPost = new SociaModel(postData);
    await newPost.save();

    // Populate the user field before returning
    const populatedPost = await SociaModel.findById(newPost._id)
      .populate("user", "name") // include only 'name' of user
      .populate("comments.user", "name"); // include name of comment users

    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(500).json({
      message: "Error creating post",
      error: error.message,
    });
  }
};

// Get all posts with user and comments.user names
const getAllPosts = async (req, res) => {
  try {
    const posts = await SociaModel.find()
      .populate("user", "name")
      .populate("comments.user", "name")
      .sort({ createdAt: -1 }); // latest post first

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching posts",
      error: error.message,
    });
  }
};

module.exports = {
  createPost,
  getAllPosts,
};
