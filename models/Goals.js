const mongoose = require("mongoose");

const GoalSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    // Type of goal: 'daily', 'weekly', or 'not-to-do'
    goalType: {
      type: String,
      required: true,
      enum: ["daily", "weekly", "not-to-do"],
    },
    // The main text content of the goal
    content: {
      type: String,
      max: 500,
      required: true,
    },
    // The user's plan to achieve the goal
    achievementPlan: {
      type: String,
      max: 1000,
    },
    // Status to track progress
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Goal", GoalSchema);