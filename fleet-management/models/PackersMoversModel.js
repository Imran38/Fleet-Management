const mongoose = require('mongoose');

const PackersMoversSchema = new mongoose.Schema({
  requestId: { type: String, unique: true, required: true },
  requestDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['Pending', 'In Progress', 'Completed', 'Cancelled'], default: 'Pending' },

  customer: {
    customerId: { type: String, required: true },
    customerName: { type: String, required: true },
    contactNumber: { type: String, required: true },
    email: { type: String },
    address: { type: String, required: true },
  },

  source: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String },
  },

  destination: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String },
  },

  items: [
    {
      itemName: { type: String, required: true },
      quantity: { type: Number, required: true },
      weight: { type: Number },
      fragile: { type: Boolean, default: false },
      notes: { type: String },
    },
  ],

  transportation: {
    vehicleType: { type: String, enum: ['Mini Truck', 'Medium Truck', 'Large Truck'], required: true },
    numberOfVehicles: { type: Number, required: true },
    packagingRequired: { type: Boolean, default: false },
    insuranceRequired: { type: Boolean, default: false },
  },

  pricing: {
    estimatedCost: { type: Number, required: true },
    finalCost: { type: Number },
    paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Partially Paid'], default: 'Pending' },
    paymentMode: { type: String, enum: ['Cash', 'Credit Card', 'Online Transfer', 'Other'], default: 'Cash' },
  },

  operationalDetails: {
    pickupDate: { type: Date, required: true },
    deliveryDate: { type: Date },
    assignedDriverId: { type: String },
    assignedVehicleId: { type: String },
    trackingUrl: { type: String },
    exceptionLogs: [
      {
        timestamp: { type: Date, default: Date.now },
        message: { type: String },
      },
    ],
  },
});

module.exports = mongoose.model('PackersMovers', PackersMoversSchema);
