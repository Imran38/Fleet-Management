const Alert = require('../models/alertsModel');

// Create a new alert
async function createAlert(alertData) {
  try {
    const alert = new Alert(alertData);
    const savedAlert = await alert.save();
    return savedAlert;
  } catch (error) {
    throw new Error(`Error creating alert: ${error.message}`);
  }
}

// Get all alerts
async function getAllAlerts() {
  try {
    const alerts = await Alert.find();
    return alerts;
  } catch (error) {
    throw new Error(`Error retrieving alerts: ${error.message}`);
  }
}

// Get a specific alert by ID
async function getAlertById(alertId) {
  try {
    const alert = await Alert.findById(alertId);
    if (!alert) {
      throw new Error(`Alert with ID ${alertId} not found`);
    }
    return alert;
  } catch (error) {
    throw new Error(`Error retrieving alert: ${error.message}`);
  }
}

// Update an alert by ID
async function updateAlert(alertId, updateData) {
  try {
    const updatedAlert = await Alert.findByIdAndUpdate(alertId, updateData, {
      new: true,
      runValidators: true,
    });
    if (!updatedAlert) {
      throw new Error(`Alert with ID ${alertId} not found`);
    }
    return updatedAlert;
  } catch (error) {
    throw new Error(`Error updating alert: ${error.message}`);
  }
}

// Delete an alert by ID
async function deleteAlert(alertId) {
  try {
    const deletedAlert = await Alert.findByIdAndDelete(alertId);
    if (!deletedAlert) {
      throw new Error(`Alert with ID ${alertId} not found`);
    }
    return deletedAlert;
  } catch (error) {
    throw new Error(`Error deleting alert: ${error.message}`);
  }
}

module.exports = {
  createAlert,
  getAllAlerts,
  getAlertById,
  updateAlert,
  deleteAlert,
};
