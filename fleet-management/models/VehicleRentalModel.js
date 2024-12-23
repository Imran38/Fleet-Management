const mongoose = require('mongoose');

const VehicleRentalSchema = new mongoose.Schema({
  rentalId: { type: String, unique: true, required: true },
  vehicleId: { type: String, required: true },
  make: { type: String },
  model: { type: String },
  year: { type: Number },
  type: { type: String, enum: ['Sedan', 'SUV', 'Truck', 'Van', 'Other'] },
  licensePlate: { type: String },
  mileage: { type: Number },
  fuelType: { type: String, enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'Other'] },
  seatingCapacity: { type: Number },
  features: [String], // Array of features like GPS, AC
  
  rentalDetails: {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    rentalType: { type: String, enum: ['Short-term', 'Long-term'], required: true },
    rentalStatus: { type: String, enum: ['Active', 'Completed', 'Cancelled'], default: 'Active' },
    dailyRate: { type: Number, required: true },
    weeklyRate: { type: Number },
    monthlyRate: { type: Number },
    depositAmount: { type: Number, required: true },
  },

  customer: {
    customerId: { type: String, required: true },
    customerName: { type: String, required: true },
    contactNumber: { type: String, required: true },
    email: { type: String },
    address: { type: String },
  },

  operationalDetails: {
    pickupLocation: { type: String, required: true },
    dropoffLocation: { type: String, required: true },
    additionalCharges: [
      {
        description: { type: String },
        amount: { type: Number },
      },
    ],
    paymentStatus: { type: String, enum: ['Paid', 'Pending'], default: 'Pending' },
    contract: { type: String }, // URL or file reference
  },

  rentalConditions: {
    mileageLimit: { type: Number }, // Optional mileage limit
    insuranceIncluded: { type: Boolean, default: false },
    additionalDriversAllowed: { type: Boolean, default: false },
    notes: { type: String },
  },
});

module.exports = mongoose.model('VehicleRental', VehicleRentalSchema);
