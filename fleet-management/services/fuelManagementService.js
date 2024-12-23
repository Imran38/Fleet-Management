const FuelManagement = require('../models/fuelManagementModel');

// Create a new fuel entry
async function createFuelEntry(fuelData) {
  try {
  
    const fuelEntry = new FuelManagement(fuelData);
    const savedFuelEntry = await fuelEntry.save();
    return savedFuelEntry;
  } catch (error) {
    throw new Error(`Error creating fuel entry: ${error.message}`);
  }
}

// Get all fuel entries
async function getAllFuelEntries() {
  try {
    const fuelEntries = await FuelManagement.find();
    return fuelEntries;
  } catch (error) {
    throw new Error(`Error retrieving fuel entries: ${error.message}`);
  }
}

async function getFuelEntries({ page = 1, pageSize = 10, sortField = 'recordId', sortOrder = 'asc' }) {
    const skip = (page - 1) * pageSize;
    const sort = { [sortField]: sortOrder === 'asc' ? 1 : -1 };
  
    const totalRecords = await FuelManagement.countDocuments();
    const records = await FuelManagement.find()
      .sort(sort)
      .skip(skip)
      .limit(pageSize);
  
    return {
      records,
      totalCount: totalRecords,
    };
  }

// Get a specific fuel entry by ID
async function getFuelEntryById(fuelEntryId) {
  try {
    const fuelEntry = await FuelManagement.findById(fuelEntryId);
    if (!fuelEntry) {
      throw new Error(`Fuel entry with ID ${fuelEntryId} not found`);
    }
    return fuelEntry;
  } catch (error) {
    throw new Error(`Error retrieving fuel entry: ${error.message}`);
  }
}

// Update a fuel entry by ID
async function updateFuelEntry(fuelEntryId, updateData) {
  try {
    const updatedFuelEntry = await FuelManagement.findByIdAndUpdate(fuelEntryId, updateData, {
      new: true,
      runValidators: true,
    });
    if (!updatedFuelEntry) {
      throw new Error(`Fuel entry with ID ${fuelEntryId} not found`);
    }
    return updatedFuelEntry;
  } catch (error) {
    throw new Error(`Error updating fuel entry: ${error.message}`);
  }
}

// Delete a fuel entry by ID
async function deleteFuelEntry(fuelEntryId) {
  try {
    const deletedFuelEntry = await FuelManagement.findByIdAndDelete(fuelEntryId);
    if (!deletedFuelEntry) {
      throw new Error(`Fuel entry with ID ${fuelEntryId} not found`);
    }
    return deletedFuelEntry;
  } catch (error) {
    throw new Error(`Error deleting fuel entry: ${error.message}`);
  }
}

module.exports = {
  createFuelEntry,
  getAllFuelEntries,
  getFuelEntryById,
  updateFuelEntry,
  deleteFuelEntry,
  getFuelEntries,
};
