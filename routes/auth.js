const express = require("express");
const {
  register,
  login,
  forgotPassword,
  verifyOtp,
  resetPassword,
  getUserProfile,
} = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);
router.get("/profile", protect, getUserProfile); // Get own profile (authenticated)
router.get("/profile/:id", getUserProfile); // Get profile by ID (public)

module.exports = router;
