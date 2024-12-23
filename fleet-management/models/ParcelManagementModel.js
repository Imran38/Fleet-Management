const mongoose = require("mongoose");

const ParcelManagementSchema = new mongoose.Schema({
  parcelId: { type: String, required: true, unique: true }, // Unique and required field
  trackingNumber: { type: String, required: true, unique: true }, // Unique tracking number
  
  parcelDetails: {
    weight: { type: String }, 
    dimensions: {
      length: { type: Number }, 
      width: { type: Number},   
      height: { type: Number },  
    },
    description: { type: String }, // Optional description
    specialInstructions: { type: String }, // Optional special handling instructions
    value: { type: Number }, // Value for insurance purposes
    category: { type: String, enum: ["Fragile", "Perishable", "Electronics", "Other"], default: "Other" }, // Parcel category
  },

  sender: {
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true },
    contact: {
      phone: { type: String, required: true },
      email: { type: String },
    },
  },

  recipient: {
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true },
    contact: {
      phone: { type: String, required: true },
      email: { type: String },
    },
  },

  payment: {
    status: { type: String, enum: ["Paid", "Unpaid"], required: true },
    mode: { type: String, enum: ["Cash", "Credit Card", "Online Payment", "Other"], default: "Other" },
    shippingCost: { type: Number },
    insuranceFee: { type: Number },
  },

  transport: {
    routeId: { type: String }, // Associated route ID
    vehicleId: { type: String }, // ID of the assigned vehicle
    driverId: { type: String }, // Driver ID
    estimatedDelivery: { type: Date },
    deliveryConfirmation: {      
      signature: { type: String }, // URL for the signature file
      proofOfDelivery: { type: String }, // URL for proof of delivery file
    },
  }, 

  tracking: {
     history: [
      {
        location: { type: String, required: true },
        status: { type: String, required: true },
        timestamp: { type: Date, required: true },
      },
    ],
    geoLocation: [{
      latitude: { type: Number },
      longitude: { type: Number },
    }],    
  },

  currentStatus: { type: String, required: true, enum: ["In Transit", "Delivered", "Out for Delivery", "Pending"] },  
  conditionOnArrival: { type: String, enum: ["Intact", "Damaged", "Unknown"], default: "Unknown" },
  exceptionLogs: [
    {
      timestamp: { type: Date, required: true },
      message: { type: String, required: true },
    },
  ],
});

module.exports = mongoose.model("ParcelManagement", ParcelManagementSchema);
