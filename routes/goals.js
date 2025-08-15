const express = require("express");
const {
  createGoal,
  getGoals,
  updateGoal,
  deleteGoal,
} = require("../controllers/goalsController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Get all goals for the logged-in user & create a new one.
// Both routes are protected.
router.get("/", protect, getGoals);
router.post("/", protect, createGoal);

// Update and delete a specific goal by its ID.
// Both routes are protected.
router.put("/:id", protect, updateGoal);
router.delete("/:id", protect, deleteGoal);

module.exports = router;
