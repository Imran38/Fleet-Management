const express = require('express');
const router = express.Router();
const alertsService = require('../services/alertsService');

// Create a new alert
router.post('/', async (req, res) => {
  try {
    const alertData = req.body;
    const newAlert = await alertsService.createAlert(alertData);
    res.status(201).json(newAlert);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all alerts
router.get('/', async (req, res) => {
  try {
    const alerts = await alertsService.getAllAlerts();
    res.status(200).json(alerts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific alert by ID
router.get('/:id', async (req, res) => {
  try {
    const alertId = req.params.id;
    const alert = await alertsService.getAlertById(alertId);
    res.status(200).json(alert);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Update an alert by ID
router.put('/:id', async (req, res) => {
  try {
    const alertId = req.params.id;
    const updateData = req.body;
    const updatedAlert = await alertsService.updateAlert(alertId, updateData);
    res.status(200).json(updatedAlert);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete an alert by ID
router.delete('/:id', async (req, res) => {
  try {
    const alertId = req.params.id;
    const deletedAlert = await alertsService.deleteAlert(alertId);
    res.status(200).json({ message: 'Alert deleted successfully', alert: deletedAlert });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

module.exports = router;
