const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ["goals", "subscriptions", "feeds"], // Optional strict enum
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
