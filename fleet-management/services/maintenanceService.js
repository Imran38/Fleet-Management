const Maintenance = require('../models/maintenanceModel');

// Create a new maintenance record
async function createMaintenanceRecord(maintenanceData) {
  try {
    const maintenance = new Maintenance(maintenanceData);
    const savedMaintenance = await maintenance.save();
    return savedMaintenance;
  } catch (error) {
    throw new Error(`Error creating maintenance record: ${error.message}`);
  }
}

// Get all maintenance records
async function getAllMaintenanceRecords() {
  try {
    const maintenanceRecords = await Maintenance.find();
    return maintenanceRecords;
  } catch (error) {
    throw new Error(`Error retrieving maintenance records: ${error.message}`);
  }
}

async function getMaintenance({ page, pageSize, sortField, sortOrder }) {
  const skip = (page - 1) * pageSize;
  const sort = { [sortField]: sortOrder === 'asc' ? 1 : -1 };
  const totalCount = await Maintenance.countDocuments();
  const records = await Maintenance.find().sort(sort).skip(skip).limit(pageSize);
  return { totalCount, records };
}

// Get a specific maintenance record by ID
async function getMaintenanceRecordById(maintenanceId) {
  try {
    const maintenanceRecord = await Maintenance.findById(maintenanceId);
    if (!maintenanceRecord) {
      throw new Error(`Maintenance record with ID ${maintenanceId} not found`);
    }
    return maintenanceRecord;
  } catch (error) {
    throw new Error(`Error retrieving maintenance record: ${error.message}`);
  }
}

// Update a maintenance record by ID
async function updateMaintenanceRecord(maintenanceId, updateData) {
  try {
    const updatedMaintenance = await Maintenance.findOneAndUpdate({maintenanceId}, updateData, {
      new: true,
      runValidators: true,
    });
    if (!updatedMaintenance) {
      throw new Error(`Maintenance record with ID ${maintenanceId} not found`);
    }
    return updatedMaintenance;
  } catch (error) {
    throw new Error(`Error updating maintenance record: ${error.message}`);
  }
}

// Delete a maintenance record by ID
async function deleteMaintenanceRecord(maintenanceId) {
  try {
    const deletedMaintenance = await Maintenance.findOneAndDelete({maintenanceId});
    if (!deletedMaintenance) {
      throw new Error(`Maintenance record with ID ${maintenanceId} not found`);
    }
    return deletedMaintenance;
  } catch (error) {
    throw new Error(`Error deleting maintenance record: ${error.message}`);
  }
}

module.exports = {
  createMaintenanceRecord,
  getAllMaintenanceRecords,
  getMaintenanceRecordById,
  updateMaintenanceRecord,
  deleteMaintenanceRecord,
  getMaintenance,
};
