const mongoose = require("mongoose");

const ComplianceSchema = new mongoose.Schema({
  complianceId: { type: String, required: true, unique: true },
  vehicleId: { type: String, required: true },
  driverId: { type: String },
  notes: { type: String },
  complianceList: [
    {
      name: { type: String, required: true }, // Name of the compliance
      issueDate: { type: Date, required: true }, // Date of issue
      expiryDate: { type: Date, required: true }, // Date of expiry
      validity: { type: String, enum: ["Valid", "Expired"], required: true }, // Validity status
    },
  ],
});

module.exports = mongoose.model("Compliance", ComplianceSchema);
