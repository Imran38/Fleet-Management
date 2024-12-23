const express = require('express');
const router = express.Router();
const fleetAnalyticsService = require('../services/fleetAnalyticsService');

// Route to create new fleet analytics data
router.post('/', async (req, res) => {
  try {
    const analyticsData = req.body;
    const createdAnalytics = await fleetAnalyticsService.createFleetAnalytics(analyticsData);
    res.status(201).json(createdAnalytics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to get all fleet analytics data
router.get('/', async (req, res) => {
  try {
    const analyticsRecords = await fleetAnalyticsService.getAllFleetAnalytics();
    res.status(200).json(analyticsRecords);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to get specific fleet analytics data by ID
router.get('/:id', async (req, res) => {
  try {
    const analyticsId = req.params.id;
    const analyticsRecord = await fleetAnalyticsService.getFleetAnalyticsById(analyticsId);
    res.status(200).json(analyticsRecord);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Route to update fleet analytics data by ID
router.put('/:id', async (req, res) => {
  try {
    const analyticsId = req.params.id;
    const updateData = req.body;
    const updatedAnalytics = await fleetAnalyticsService.updateFleetAnalytics(analyticsId, updateData);
    res.status(200).json(updatedAnalytics);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Route to delete fleet analytics data by ID
router.delete('/:id', async (req, res) => {
  try {
    const analyticsId = req.params.id;
    const deletedAnalytics = await fleetAnalyticsService.deleteFleetAnalytics(analyticsId);
    res.status(200).json(deletedAnalytics);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

module.exports = router;
