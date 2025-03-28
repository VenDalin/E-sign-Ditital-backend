const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const signatureRoutes = require("./routes/signatureRoutes");

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: "5mb" }));

app.get("/", (req, res) => {
  res.send("Backend server is running!");
});

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/signaturesDB")
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api", signatureRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
