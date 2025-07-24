
const express = require("express");
const { getMessages } = require("../controllers/messages");

const router = express.Router();

router.get("/", getMessages); // e.g. /api/messages?category=goals

module.exports = router;
