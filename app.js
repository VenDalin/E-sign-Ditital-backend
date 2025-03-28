const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require("http"); // Required for Socket.IO
const { Server } = require("socket.io"); // Import Socket.IO

const signatureRoutes = require("./routes/signatureRoutes");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust this to match your frontend URL in production
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});
app.use(cors());
app.use(bodyParser.json({ limit: "5mb" }));

app.get("/", (req, res) => {
  res.json({status: 200, message: "Backend is running..."});
});

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/signaturesDB")
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api", signatureRoutes);

app.get("/health", (req, res) => {
  res.json({status: 200, message: "Api is running..."});
});

// Socket.IO connection
io.on("connection", (socket) => {
  console.log("A client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("A client disconnected:", socket.id);
  });
});

// Pass the `io` instance to the routes so they can emit events
app.set("socketio", io);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
