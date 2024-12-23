const mongoose = require('mongoose');

const RouteSchema = new mongoose.Schema({
  routeId: { type: String, required: true, unique: true }, // Unique and required
  name: { type: String, required: true }, // Required
  startLocation: { type: String, required: true }, // Required
  endLocation: { type: String, required: true }, // Required
  distance: { type: Number }, // Optional
  estimatedTime: { type: String }, // Optional
  assignedVehicleId: { type: String }, // Optional
  assignedDriverId: { type: String }, // Optional
  routeMapUrl: { type: String }, // Optional (Google Map URL)
});


module.exports = mongoose.model('Route', RouteSchema);
