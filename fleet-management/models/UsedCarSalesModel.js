const mongoose = require('mongoose');

const UsedVehicleSchema = new mongoose.Schema({
  vehicleId: { type: String, unique: true, required: true },
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  type: { type: String, enum: ['Sedan', 'SUV', 'Truck', 'Hatchback', 'Van', 'Other'], required: true },
  licensePlate: { type: String },
  odometer: { type: Number, required: true },
  fuelType: { type: String, enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG', 'Other'], required: true },
  engineCapacity: { type: Number },
  seatingCapacity: { type: Number },
  mileage: { type: Number },
  color: { type: String },
  transmission: { type: String, enum: ['Automatic', 'Manual'], required: true },
  registrationState: { type: String },

  condition: { type: String, enum: ['New', 'Used', 'Certified Pre-Owned'], required: true },
  tyreCondition: { type: String, enum: ['New', 'Used'], default: 'Used' },
  batteryCondition: { type: String, enum: ['New', 'Old'], default: 'Old' },
  accidental: { type: Boolean, default: false },
  serviceHistory: { type: Boolean, default: false },
  gpsInstalled: { type: Boolean, default: false },
  features: [String], // Array of additional features

  price: { type: Number, required: true },
  negotiable: { type: Boolean, default: false },
  insuranceIncluded: { type: Boolean, default: false },

  seller: {
    sellerId: { type: String, required: true },
    sellerName: { type: String, required: true },
    contactNumber: { type: String, required: true },
    email: { type: String },
    address: { type: String },
  },

  media: {
    images: [String], // Array of image URLs
    videoUrl: { type: String },
    documents: [String], // Array of document URLs
  },

  salesInfo: {
    availabilityStatus: { type: String, enum: ['Available', 'Sold'], default: 'Available' },
    listedDate: { type: Date, default: Date.now },
    soldDate: { type: Date },
  },

  notes: { type: String },
});

module.exports = mongoose.model('UsedVehicle', UsedVehicleSchema);
