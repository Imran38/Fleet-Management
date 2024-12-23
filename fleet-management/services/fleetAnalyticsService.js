const FleetAnalytics = require('../models/fleetAnalyticsModel');

// Create a new fleet analytics record
async function createFleetAnalytics(analyticsData) {
  try {
    const analytics = new FleetAnalytics(analyticsData);
    const savedAnalytics = await analytics.save();
    return savedAnalytics;
  } catch (error) {
    throw new Error(`Error creating fleet analytics: ${error.message}`);
  }
}

// Get all fleet analytics records
async function getAllFleetAnalytics() {
  try {
    const analytics = await FleetAnalytics.find();
    return analytics;
  } catch (error) {
    throw new Error(`Error retrieving fleet analytics: ${error.message}`);
  }
}

// Get a specific fleet analytics record by ID
async function getFleetAnalyticsById(analyticsId) {
  try {
    const analytics = await FleetAnalytics.findById(analyticsId);
    if (!analytics) {
      throw new Error(`Fleet analytics record with ID ${analyticsId} not found`);
    }
    return analytics;
  } catch (error) {
    throw new Error(`Error retrieving fleet analytics: ${error.message}`);
  }
}

// Update a fleet analytics record by ID
async function updateFleetAnalytics(analyticsId, updateData) {
  try {
    const updatedAnalytics = await FleetAnalytics.findByIdAndUpdate(analyticsId, updateData, {
      new: true,
      runValidators: true,
    });
    if (!updatedAnalytics) {
      throw new Error(`Fleet analytics record with ID ${analyticsId} not found`);
    }
    return updatedAnalytics;
  } catch (error) {
    throw new Error(`Error updating fleet analytics: ${error.message}`);
  }
}

// Delete a fleet analytics record by ID
async function deleteFleetAnalytics(analyticsId) {
  try {
    const deletedAnalytics = await FleetAnalytics.findByIdAndDelete(analyticsId);
    if (!deletedAnalytics) {
      throw new Error(`Fleet analytics record with ID ${analyticsId} not found`);
    }
    return deletedAnalytics;
  } catch (error) {
    throw new Error(`Error deleting fleet analytics: ${error.message}`);
  }
}

module.exports = {
  createFleetAnalytics,
  getAllFleetAnalytics,
  getFleetAnalyticsById,
  updateFleetAnalytics,
  deleteFleetAnalytics,
};
