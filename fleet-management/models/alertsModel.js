const mongoose = require('mongoose');

const AlertsSchema = new mongoose.Schema({
  alertId: String,
  vehicleId: String,
  driverId: String,
  type: String, // e.g., Maintenance Alert, Fuel Alert
  message: String,
  severity: String, // e.g., High, Medium, Low
  timestamp: Date,
});

module.exports = mongoose.model('Alerts', AlertsSchema);
