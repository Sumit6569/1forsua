// routes/social.js
const express = require("express");
const router = express.Router();
const { createPost, getAllPosts } = require("../controllers/SocialController");
const upload = require("../middleware/upload");

// Create post with optional image upload
router.post("/create", upload.single("image"), createPost);
router.get("/all", getAllPosts);

module.exports = router;
