const mongoose = require('mongoose');

const FuelManagementSchema = new mongoose.Schema({
  recordId: { type: String, required: true, unique: true },
  vehicleId: { type: String, required: true },
  driverId: { type: String, required: true },
  fuelType: { 
    type: String, 
    enum: ['Diesel', 'Petrol', 'CNG', 'Electric', 'Other'], 
    required: true 
  },
  fuelQuantity: { type: String, required: true }, // Alphanumeric quantity
  cost: { type: Number, required: true },
  date: { type: Date, required: true },
  location: { type: String },
  notes: { type: String },
  tripId: { type: String }, // New optional field
  receiptImage: { type: String }, // New field for image
  paymentType: { 
    type: String, 
    enum: ['Cash', 'Credit Card', 'Online Transfer', 'Other'], 
    required: true 
  },
  receiptNumber: { type: String, required: true }, // New field
});

module.exports = mongoose.model('FuelManagement', FuelManagementSchema);
