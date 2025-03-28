const Signature = require("../models/Signature");

// Upload signature
exports.uploadSignature = async (req, res) => {
  try {
    const { signature } = req.body;
    if (!signature) return res.status(400).json({ error: "Signature is required" });

    const newSignature = new Signature({ signature });
    await newSignature.save();

    // Emit a Socket.IO event to all connected clients
    if (req.io) {
      req.io.emit("signatureAdded", newSignature);
    }

    res.json({ message: "Signature saved successfully!" });
  } catch (error) {
    console.error("Error uploading signature:", error);
    res.status(500).json({ error: "Failed to save signature" });
  }
};

// Get all signatures
exports.getAllSignatures = async (req, res) => {
  try {
    const signatures = await Signature.find();
    res.json(signatures);
  } catch (error) {
    console.error("Error retrieving signatures:", error);
    res.status(500).json({ error: "Failed to retrieve signatures" });
  }
};

// Delete signature by ID
exports.deleteSignature = async (req, res) => {
  try {
    const { id } = req.params; // Expecting ID in URL (e.g., /api/signatures/:id)
    if (!id) return res.status(400).json({ error: "Signature ID is required" });

    const signature = await Signature.findByIdAndDelete(id);
    if (!signature) return res.status(404).json({ error: "Signature not found" });

    // Emit a Socket.IO event to all connected clients
    if (req.io) {
      req.io.emit("signatureDeleted", id);
    }

    res.json({ message: "Signature deleted successfully!" });
  } catch (error) {
    console.error("Error deleting signature:", error);
    res.status(500).json({ error: "Failed to delete signature" });
  }
};

// Update signature by ID
exports.updateSignature = async (req, res) => {
  try {
    const { id } = req.params; // Expecting ID in URL (e.g., /api/signatures/:id)
    const { signature } = req.body; // New signature data

    if (!id) return res.status(400).json({ error: "Signature ID is required" });
    if (!signature) return res.status(400).json({ error: "New signature data is required" });

    const updatedSignature = await Signature.findByIdAndUpdate(
      id,
      { signature, updatedAt: Date.now() }, // Update signature and timestamp
      { new: true } // Return the updated document
    );

    if (!updatedSignature) return res.status(404).json({ error: "Signature not found" });

    // Emit a Socket.IO event to all connected clients
    if (req.io) {
      req.io.emit("signatureUpdated", updatedSignature);
    }

    res.json({ message: "Signature updated successfully!", signature: updatedSignature });
  } catch (error) {
    console.error("Error updating signature:", error);
    res.status(500).json({ error: "Failed to update signature" });
  }
};

module.exports = {
  uploadSignature: exports.uploadSignature,
  getAllSignatures: exports.getAllSignatures,
  deleteSignature: exports.deleteSignature,
  updateSignature: exports.updateSignature,
};