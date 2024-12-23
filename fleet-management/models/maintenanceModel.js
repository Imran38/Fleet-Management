const mongoose = require('mongoose');

const MaintenanceSchema = new mongoose.Schema({
  maintenanceId: { type: String, required: true, unique: true }, // Unique and required
  vehicleId: { type: String, required: true }, // Required
  maintenanceType: { type: String, required: true }, // Required
  date: { type: Date }, // Optional
  cost: { type: Number }, // Optional
  serviceCenter: { type: String }, // Optional
  notes: { type: String }, // Optional
  status: { type: String }, // Optional (e.g., Scheduled, Completed)
});

module.exports = mongoose.model('Maintenance', MaintenanceSchema);
