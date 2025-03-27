const mongoose = require("mongoose");

const signaturesSchema = new mongoose.Schema({
    signature: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
  });
module.exports = mongoose.model("Signature", signaturesSchema);
