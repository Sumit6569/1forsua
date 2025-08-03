const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

const genToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

exports.register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    if (password !== confirmPassword)
      return res.status(400).json({ message: "Passwords do not match" });

    const user = await User.create({ name, email, password });
    res.status(201).json({ token: genToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
     });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    res.json({ token: genToken(user._id) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    // Use user ID from JWT token if authenticated, otherwise from URL parameter
    const userId = req.user?.id || req.params.id;

    if (!userId) {
      return res.status(400).json({ message: "User ID required" });
    }

    const user = await User.findById(userId).select("-password"); // Exclude password
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });
  console.log("📩 Forgot Password triggered with:", email);

  const otp = crypto.randomInt(100000, 999999).toString();
  user.otp = otp;
  user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 min
  await user.save({ validateBeforeSave: false });

  try {
    await sendEmail(
      email,
      "Your OTP Code",
      `<p>Your verification code is <b>${otp}</b>. It expires in 10 min.</p>`
    );
  } catch (err) {
    console.error("❌ Email sending failed:", err.message);
    return res.status(500).json({ message: "Failed to send OTP email" });
  }

  res.json({ message: "OTP sent" });
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({
    email,
    otp,
    otpExpires: { $gt: Date.now() },
  });
  if (!user) return res.status(400).json({ message: "OTP invalid/expired" });

  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save({ validateBeforeSave: false });

  res.json({ token: genToken(user._id) });
};

exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const user = await User.findOne({
    email,
    otp,
    otpExpires: { $gt: Date.now() },
  });
  if (!user) return res.status(400).json({ message: "OTP invalid/expired" });

  user.password = newPassword;
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();

  res.json({ message: "Password reset successful" });
};
