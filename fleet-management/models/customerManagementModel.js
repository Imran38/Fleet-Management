const mongoose = require('mongoose');

const CustomerManagementSchema = new mongoose.Schema({
  customerId: { type: String, required: true, unique: true },
  name: { type: String, required: true},
  contactNumber: { type: String, required: true},
  email: { type: String},
  address: { type: String},
  city: {type: String },
  associatedTrips: [String], // Array of trip IDs
});

module.exports = mongoose.model('CustomerManagement', CustomerManagementSchema);
