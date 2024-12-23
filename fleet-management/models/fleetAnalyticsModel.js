const mongoose = require('mongoose');

const FleetAnalyticsSchema = new mongoose.Schema({
  reportId: String,
  vehicleId: String,
  driverId: String,
  metrics: {
    fuelEfficiency: Number,
    distanceTraveled: Number,
    maintenanceCost: Number,
  },
  generatedDate: Date,
});

module.exports = mongoose.model('FleetAnalytics', FleetAnalyticsSchema);
