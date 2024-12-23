const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
  itemId: { type: String, required: true, unique: true }, // Unique and required
  itemName: { type: String, required: true }, // Required
  quantity: { type: Number, required: true }, // Required
  lastUpdated: { type: Date }, // Optional
  location: { type: String }, // Optional
  associatedVehicleId: { type: String }, // Optional
});

module.exports = mongoose.model('Inventory', InventorySchema);
