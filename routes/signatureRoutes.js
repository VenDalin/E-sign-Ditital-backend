const express = require("express");
const {
  uploadSignature,
  getAllSignatures,
  deleteSignature,
  updateSignature,
} = require("../controllers/signatureController");

const router = express.Router();

router.post("/signatures", uploadSignature); // Changed from /upload to /signatures
router.get("/signatures", getAllSignatures);
router.delete("/signatures/:id", deleteSignature);
router.put("/signatures/:id", updateSignature);

module.exports = router;
