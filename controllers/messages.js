const Message = require("../models/messageModel");

// @desc Get all messages, optionally filtered by category
exports.getMessages = async (req, res, next) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const messages = await Message.find(filter);
    res.json(messages);
  } catch (error) {
    next(error);
  }
};
