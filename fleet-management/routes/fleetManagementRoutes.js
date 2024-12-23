const express = require('express');
const router = express.Router();
const fleetManagementService = require('../services/fleetManagementService');

// Route to create a new fleet record
router.post('/', async (req, res) => {
  try {
    const fleetData = req.body;
    const createdFleet = await fleetManagementService.createFleet(fleetData);
    res.status(201).json(createdFleet);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to get all fleet records
router.get('/', async (req, res) => {
  try {
    const fleetRecords = await fleetManagementService.getAllFleets();
    res.status(200).json(fleetRecords);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to get a specific fleet record by ID
router.get('/:id', async (req, res) => {
  try {
    const fleetId = req.params.id;
    const fleetRecord = await fleetManagementService.getFleetById(fleetId);
    res.status(200).json(fleetRecord);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Route to update a fleet record by ID
router.put('/:id', async (req, res) => {
  try {
    const fleetId = req.params.id;
    const updateData = req.body;
    const updatedFleet = await fleetManagementService.updateFleet(fleetId, updateData);
    res.status(200).json(updatedFleet);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Route to delete a fleet record by ID
router.delete('/:id', async (req, res) => {
  try {
    const fleetId = req.params.id;
    const deletedFleet = await fleetManagementService.deleteFleet(fleetId);
    res.status(200).json(deletedFleet);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

module.exports = router;
