const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  driverId: { type: String, required: true },
  name: { type: String, required: true },
  licenseNumber: { type: String, required: true },
  licenseExpiry: { type: Date, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  yearsOfExperience: { type: Number, default: 0 }, // New field
  salary: { type: Number, default: 0 }, // New field
  assignedVehicleId: { type: String }, // Reference to the vehicle
  performance: {
    accidents: { type: Number, default: 0 },
    violations: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
  },
  // New fields
  DOB: { type: Date, required: true }, // Date of Birth
  address: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  code: { type: Number, required: true }, // Postal/ZIP code
  licenseType: { type: String, required: true }, // License type, e.g., Commercial, Private
  addressVerified: { type: String, enum: ['Yes', 'No'], default: 'No' },
  eyeglass: { type: String, enum: ['Yes', 'No'], default: 'No' }, // Does the driver wear eyeglasses
  medicalCondition: { type: String, default: 'None' }, // Describe any medical conditions
  medicalFitness: { type: String, enum: ['Yes', 'No'], default: 'Yes' }, // Is the driver medically fit
  image: { type: String }, // Path or URL to the driver's picture
});

module.exports = mongoose.model('Driver', driverSchema);
