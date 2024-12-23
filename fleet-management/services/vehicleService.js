const Vehicle = require('../models/vehicleModel');


// Create a new vehicle
async function createVehicle(vehicleData) {
  try {

    // Check for existing vehicle with the same vehicleId
    const existingVehicle = await Vehicle.findOne({ vehicleId: vehicleData.vehicleId });
    if (existingVehicle) {
      throw new Error("Vehicle with this ID already exists.");
    }

    const vehicle = new Vehicle(vehicleData);
    const savedVehicle = await vehicle.save();
    return savedVehicle;
  } catch (error) {
    throw new Error(`Error creating vehicle: ${error.message}`);
  }
}

// Get all vehicles
async function getAllVehicles() {
  try {
    const vehicles = await Vehicle.find();
    return vehicles;
  } catch (error) {
    throw new Error(`Error retrieving vehicles: ${error.message}`);
  }
}

// Get a specific vehicle by ID
async function getVehicleById(vehicleId) {
  try {
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      throw new Error(`Vehicle with ID ${vehicleId} not found`);
    }
    return vehicle;
  } catch (error) {
    throw new Error(`Error retrieving vehicle: ${error.message}`);
  }
}

// Update a vehicle by ID
async function updateVehicle(vehicleId, updateData) {
  try {
    const updatedVehicle = await Vehicle.findByIdAndUpdate(vehicleId, updateData, {
      new: true,
      runValidators: true,
    });
    if (!updatedVehicle) {
      throw new Error(`Vehicle with ID ${vehicleId} not found`);
    }
    return updatedVehicle;
  } catch (error) {
    throw new Error(`Error updating vehicle: ${error.message}`);
  }
}

// Delete a vehicle by ID
async function deleteVehicle(vehicleId) {
  try {
    const deletedVehicle = await Vehicle.findByIdAndDelete(vehicleId);
    if (!deletedVehicle) {
      throw new Error(`Vehicle with ID ${vehicleId} not found`);
    }
    return deletedVehicle;
  } catch (error) {
    throw new Error(`Error deleting vehicle: ${error.message}`);
  }
}

// In vehicleService.js
async function getVehicles({ page = 1, pageSize = 5, sortField = 'vehicleId', sortOrder = 'asc', search = '' }) {
  try {
    const skip = (page - 1) * pageSize; // Calculate documents to skip
    const sortOptions = { [sortField]: sortOrder === 'asc' ? 1 : -1 }; // Sorting order

    // Build the search filter
    const filter = search
      ? {
          $or: [
            { make: { $regex: search, $options: 'i' } }, // Case-insensitive match for make
            { model: { $regex: search, $options: 'i' } }, // Case-insensitive match for model
          ],
        }
      : {};

    // Fetch vehicles with filtering, sorting, and paging
    const vehicles = await Vehicle.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(pageSize));

    // Count total documents matching the filter
    const totalCount = await Vehicle.countDocuments(filter);

    return { vehicles, totalCount };
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    throw error;
  }
}

  

module.exports = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
  getVehicles,
};
