const mongoose = require('mongoose');

const TripManagementSchema = new mongoose.Schema({
  tripId: { type: String, required: true, unique: true },
  vehicleId: { type: String, required: true },
  driverId: { type: String, required: true },
  routeId: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  distanceTraveled: { type: Number, required: true },
  status: { type: String, enum: ["Scheduled", "In-Progress", "Completed"], required: true }, 
  notes: { type: String},
  odometerStart: { type: Number }, // New field
  odometerEnd: { type: Number }, // New field
  fuelOrChargeStart: { type: Number }, // New field
  fuelOrChargeEnd: { type: Number }, // New field
  incidentalCharges: [
    {
      chargeType: { type: String, required: true }, // New field
      amount: { type: Number, required: true }, // New field
    },
  ],
  geoLocation: [{
    latitude: { type: Number },
    longitude: { type: Number },
  }],   
});

module.exports = mongoose.model('TripManagement', TripManagementSchema);
