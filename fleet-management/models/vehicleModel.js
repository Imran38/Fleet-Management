const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
  vehicleId: String,
  make: String,
  model: String,
  year: Number,
  vin: String,
  licensePlate: String,
  ownershipType: String,
  status: String,
  currentDriverId: String,
  ownerName: String, // New field
  fuelType: String, // New field
  mileage: Number, // New field
  image1: { type: String }, // Stores the URL or path to image 1
  image2: { type: String }, // Stores the URL or path to image 2
  image3: { type: String }, // Stores the URL or path to image 3

  // New properties
  odometer: { type: Number, default: 0 }, // Distance traveled by the vehicle
  accidental: { type: String, enum: ['Yes', 'No'], default: 'No' },
  color: { type: String, default: 'Unknown' },
  engineCapacity: { type: Number, default: 0 }, // Engine displacement in cc
  insuranceType: { type: String, enum: ['Comprehensive', 'Third Party'], default: 'Comprehensive' },
  lockSystem: { type: String, default: 'Unknown' },
  makeMonth: { type: String, default: 'Unknown' },
  parkingSensors: { type: String, enum: ['Yes', 'No'], default: 'No' },
  powerSteering: { type: String, enum: ['Yes', 'No'], default: 'No' },
  registrationPlace: { type: String, default: 'Unknown' },
  finance: { type: String, enum: ['Yes', 'No'], default: 'No' },
  tyreCondition: { type: String, enum: ['New', 'Used'], default: 'New' },
  gpsInstalled: { type: String, enum: ['Yes', 'No'], default: 'No' },
  loadCapacity: { type: String, default: '0kg' }, // Maximum load capacity
  serviceHistory: { type: String, enum: ['Available', 'Not Available'], default: 'Not Available' },
  seatCapacity: { type: Number, default: 0 },
  antiTheftDevice: { type: String, enum: ['Yes', 'No'], default: 'No' },
  batteryCondition: { type: String, enum: ['New', 'Old'], default: 'New' },
  vehicleCertified: { type: String, enum: ['Yes', 'No'], default: 'No' },

});

module.exports = mongoose.model('Vehicle', VehicleSchema);
