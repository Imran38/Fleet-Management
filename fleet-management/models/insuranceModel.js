const mongoose = require("mongoose");

const InsuranceSchema = new mongoose.Schema({
  insuranceId: { type: String, required: true, unique: true },
  vehicleId: { type: String, required: true },
  provider: { type: String, required: true },
  policyNumber: { type: String, required: true },
  coverageDetails: { type: String },
  startDate: { type: Date, required: true },
  expiryDate: { type: Date, required: true },
  premiumAmount: { type: Number, required: true },
  insuranceType: { 
    type: String, 
    enum: ["Third Party", "Own Damage"], // New field with specified values
    required: true 
  },
  coverageLimit: { type: Number, required: true }, // New field
  claimStatus: { 
    type: String, 
    enum: ["No Claims", "Pending", "Settled"], // New field
    default: "No Claims" 
  },
  agencyContact: { // New field for agency contact details
    name: { type: String },
    phone: { type: String },
    email: { type: String },
    address: { type: String },
  },
  insuranceContact: { // New field for insurance contact details
    name: { type: String },
    phone: { type: String },
    email: { type: String },
    address: { type: String },
  },
});


module.exports = mongoose.model("Insurance", InsuranceSchema);
