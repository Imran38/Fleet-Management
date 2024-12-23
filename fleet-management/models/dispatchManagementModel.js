const mongoose = require('mongoose');

const DispatchManagementSchema = new mongoose.Schema({
  dispatchId: { type: String, required: true, unique: true },
  vehicleId: { type: String, required: true},
  driverId: { type: String},
  routeId: { type: String},
  dispatchTime: { type: Date},
  status: { type: String, enum: ["Dispatched", "In-Transit", "Delivered"]}, 
  priority: { type: String, enum: ["High", "Medium", "Low"]}, 
  notes: { type: String},
});

module.exports = mongoose.model('DispatchManagement', DispatchManagementSchema);
