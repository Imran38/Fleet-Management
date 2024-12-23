const Driver = require('../models/driverModel');

// Create a new driver
async function createDriver(driverData) {
  try {
    // Check for existing driver with the same driverId
    const existingDriver = await Driver.findOne({ driverId: driverData.driverId });
    if (existingDriver) {
      throw new Error("Driver with this ID already exists.");
    }

    const driver = new Driver(driverData);
    const savedDriver = await driver.save();
    return savedDriver;
  } catch (error) {
    throw new Error(`Error creating driver: ${error.message}`);
  }
}

async function getDrivers({ page = 1, pageSize = 10, sortField = 'driverId', sortOrder = 'asc' }) {
    try {
      const skip = (page - 1) * pageSize;
      const sortOptions = { [sortField]: sortOrder === 'asc' ? 1 : -1 };
  
      const [drivers, totalCount] = await Promise.all([
        Driver.find().sort(sortOptions).skip(skip).limit(Number(pageSize)),
        Driver.countDocuments(),
      ]);
  
      return {
        drivers,
        totalCount,
      };
    } catch (error) {
      throw new Error('Error fetching drivers: ' + error.message);
    }
  }

// Get all drivers
async function getAllDrivers() {
  try {
    const drivers = await Driver.find();
    return drivers;
  } catch (error) {
    throw new Error(`Error retrieving drivers: ${error.message}`);
  }
}

// Get a specific driver by ID
async function getDriverById(driverId) {
  try {
    const driver = await Driver.findById(driverId);
    if (!driver) {
      throw new Error(`Driver with ID ${driverId} not found`);
    }
    return driver;
  } catch (error) {
    throw new Error(`Error retrieving driver: ${error.message}`);
  }
}

// Update a driver by ID
async function updateDriver(driverId, updateData) {
  try {
    const updatedDriver = await Driver.findByIdAndUpdate(driverId, updateData, {
      new: true,
      runValidators: true,
    });
    if (!updatedDriver) {
      throw new Error(`Driver with ID ${driverId} not found`);
    }
    return updatedDriver;
  } catch (error) {
    console.log(error);
    throw new Error(`Error updating driver: ${error.message}`);
  }
}

// Delete a driver by ID
async function deleteDriver(driverId) {
  try {
    const deletedDriver = await Driver.findByIdAndDelete(driverId);
    if (!deletedDriver) {
      throw new Error(`Driver with ID ${driverId} not found`);
    }
    return deletedDriver;
  } catch (error) {
    throw new Error(`Error deleting driver: ${error.message}`);
  }
}

module.exports = {
  createDriver,
  getAllDrivers,
  getDriverById,
  updateDriver,
  deleteDriver,
  getDrivers,
};
