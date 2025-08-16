const Goal = require("../models/Goals");

/**
 * @desc    Create a new goal for the logged-in user
 * @route   POST /api/goals
 * @access  Private
 */
exports.createGoal = async (req, res) => {
  try {
    const { goalType, content, achievementPlan } = req.body;

    // --- Validation ---
    // Check if required fields are missing from the request body.
    if (!goalType || !content) {
      return res.status(400).json({
        message: "Validation failed: 'goalType' and 'content' are required.",
      });
    }

     // Create a new goal, linking it to the authenticated user's ID
     const goal = await Goal.create({
      userId: req.user.id,  // The 'protect' middleware adds the user object to the request
      goalType,
      content,
      achievementPlan,
    });

    res.status(201).json(goal);
  } catch (err) {
    // Handle potential database errors or other validation issues from the schema.
    res.status(400).json({ message: "Error creating goal", error: err.message });
  
  }
};

/**
 * @desc    Get all goals for the logged-in user
 * @route   GET /api/goals
 * @access  Private
 */
exports.getGoals = async (req, res) => {
  try {
      // Find all goals that belong to the currently authenticated user
    const goals = await Goal.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(goals);
  } catch (err) {
    res.status(500).json({ message: "Server error while fetching goals", error: err.message });
  }
};

/**
 * @desc    Update a specific goal
 * @route   PUT /api/goals/:id
 * @access  Private
 */
exports.updateGoal = async (req, res) => {
    try {
        const goal = await Goal.findById(req.params.id);

        if (!goal) {
            return res.status(404).json({ message: "Goal not found" });
        }
        
        // Security Check: Ensure the user owns this goal
        if (goal.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: "Not authorized to edit this goal" });
        }

        const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
            new: true,  // Return the updated document
            runValidators: true,
        });

        res.json(updatedGoal);
    } catch (err) {
        res.status(500).json({ message: "Server error while updating goal", error: err.message });
    }
};

/**
 * @desc    Delete a specific goal
 * @route   DELETE /api/goals/:id
 * @access  Private
 */
exports.deleteGoal = async (req, res) => {
    try {
        const goal = await Goal.findById(req.params.id);

        if (!goal) {
            return res.status(404).json({ message: "Goal not found" });
        }
        
        // Security Check: Ensure the user owns this goal
        if (goal.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: "Not authorized to delete this goal" });
        }
        
        await goal.deleteOne();

        res.json({ message: "Goal removed successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error while deleting goal", error: err.message });
    }
};
