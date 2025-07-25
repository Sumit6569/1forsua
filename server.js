require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
// import { getMessages } from './controllers/messageController';
const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));

app.get("/", (_, res) =>
  res.send("Backend up - see /api/auth/* for endpoints")
);
app.use("/api/messages", require("./routes/messages"));

const PORT = process.env.PORT || 5050;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
