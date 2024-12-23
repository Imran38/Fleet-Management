const express = require('express');
const router = express.Router();
const complianceService = require('../services/complianceService');

// Route to create a new compliance record
router.post('/', async (req, res) => {
  try {
    const complianceData = req.body;
    const createdCompliance = await complianceService.createCompliance(complianceData);
    res.status(201).json(createdCompliance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to get all compliance records
router.get('/', async (req, res) => {
  try {
    const { page, pageSize, sortField, sortOrder } = req.query;
    const data = await complianceService.getCompliance({
      page: parseInt(page, 10) || 1,
      pageSize: parseInt(pageSize, 10) || 10,
      sortField: sortField || 'complianceId',
      sortOrder: sortOrder || 'asc',
    });
    res.json(data);
  } catch (error) {
    console.error('Error fetching compliance records:', error);
    res.status(500).json({ message: 'Error fetching compliance records', error });
  }
});

// Route to get a specific compliance record by ID
router.get('/:id', async (req, res) => {
  try {
    const complianceId = req.params.id;
    const complianceRecord = await complianceService.getComplianceById(complianceId);
    res.status(200).json(complianceRecord);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Route to update a compliance record by ID
router.put('/:id', async (req, res) => {
  try {
    const complianceId = req.params.id;
    const updateData = req.body;
    const updatedCompliance = await complianceService.updateCompliance(complianceId, updateData);
    res.status(200).json(updatedCompliance);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Route to delete a compliance record by ID
router.delete('/:id', async (req, res) => {
  try {
    const complianceId = req.params.id;
    const deletedCompliance = await complianceService.deleteCompliance(complianceId);
    res.status(200).json(deletedCompliance);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

module.exports = router;
