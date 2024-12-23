const express = require('express');
const router = express.Router();
const maintenanceService = require('../services/maintenanceService');

// Route to create a new maintenance record
router.post('/', async (req, res) => {
  try {
    const maintenanceData = req.body;
    const createdMaintenanceRecord = await maintenanceService.createMaintenanceRecord(maintenanceData);
    res.status(201).json(createdMaintenanceRecord);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to get all maintenance records
router.get('/', async (req, res) => {
  try {
    const { page, pageSize, sortField, sortOrder } = req.query;
    const data = await maintenanceService.getMaintenance({
      page: parseInt(page, 10) || 1,
      pageSize: parseInt(pageSize, 10) || 10,
      sortField: sortField || 'maintenanceId',
      sortOrder: sortOrder || 'asc',
    });
    res.json(data);
  } catch (error) {
    console.error('Error fetching maintenance records:', error);
    res.status(500).json({ message: 'Error fetching maintenance records', error });
  }
});

// Route to get a specific maintenance record by ID
router.get('/:id', async (req, res) => {
  try {
    const maintenanceId = req.params.id;
    const maintenanceRecord = await maintenanceService.getMaintenanceRecordById(maintenanceId);
    res.status(200).json(maintenanceRecord);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Route to update a maintenance record by ID
router.put('/:id', async (req, res) => {
  try {
    const maintenanceId = req.params.id;
    const updateData = req.body;
    const updatedMaintenanceRecord = await maintenanceService.updateMaintenanceRecord(maintenanceId, updateData);
    res.status(200).json(updatedMaintenanceRecord);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Route to delete a maintenance record by ID
router.delete('/:id', async (req, res) => {
  try {
    const maintenanceId = req.params.id;
    const deletedMaintenanceRecord = await maintenanceService.deleteMaintenanceRecord(maintenanceId);
    res.status(200).json(deletedMaintenanceRecord);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

module.exports = router;
