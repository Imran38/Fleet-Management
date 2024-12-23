const Parcel = require('../models/parcelManagementModel'); // Replace with actual path to the Parcel model

// Create a new parcel
async function createParcel(parcelData) {
  try {
    // Check for existing parcel with the same tracking number
    const existingParcel = await Parcel.findOne({ trackingNumber: parcelData.trackingNumber });
    
    if (existingParcel) {
      throw new Error("Parcel with this tracking number already exists.");
    }

    const parcel = new Parcel(parcelData);
    const savedParcel = await parcel.save();
    return savedParcel;
  } catch (error) {
    console.log(error.message);
    throw new Error(`Error creating parcel: ${error.message}`);
  }
}

// Get all parcels
async function getAllParcels() {
  try {
    const parcels = await Parcel.find();
    return parcels;
  } catch (error) {
    throw new Error(`Error retrieving parcels: ${error.message}`);
  }
}

// Get a specific parcel by ID
async function getParcelById(parcelId) {
  try {
    const parcel = await Parcel.findById(parcelId);
    if (!parcel) {
      throw new Error(`Parcel with ID ${parcelId} not found`);
    }
    return parcel;
  } catch (error) {
    throw new Error(`Error retrieving parcel: ${error.message}`);
  }
}

// Update a parcel by ID
async function updateParcel(parcelId, updateData) {
  try {
    const updatedParcel = await Parcel.findByIdAndUpdate(parcelId, updateData, {
      new: true,
      runValidators: true,
    });
    if (!updatedParcel) {
      throw new Error(`Parcel with ID ${parcelId} not found`);
    }
    return updatedParcel;
  } catch (error) {
    throw new Error(`Error updating parcel: ${error.message}`);
  }
}

// Delete a parcel by ID
async function deleteParcel(parcelId) {
  try {
    const deletedParcel = await Parcel.findByIdAndDelete(parcelId);
    if (!deletedParcel) {
      throw new Error(`Parcel with ID ${parcelId} not found`);
    }
    return deletedParcel;
  } catch (error) {
    throw new Error(`Error deleting parcel: ${error.message}`);
  }
}

module.exports = {
  createParcel,
  getAllParcels,
  getParcelById,
  updateParcel,
  deleteParcel,
};
