const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Message = require("./models/messageModel");

dotenv.config();

const allMessages = [
  { text: "Time to write your Goals!", category: "goals" },
  { text: "Avoid distractions – stay focused!", category: "goals" },
  { text: "You’ve got a new subscription tip!", category: "subscriptions" },
  { text: "Latest feed is now live!", category: "feeds" },
  { text: "A motivational boost for you!", category: "goals" },
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Message.deleteMany(); // Optional: clear old data
    await Message.insertMany(allMessages);
    console.log("✅ Messages Seeded");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedData();
