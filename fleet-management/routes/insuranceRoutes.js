const express = require('express');
const router = express.Router();
const insuranceService = require('../services/insuranceService');

// Route to create a new insurance record
router.post('/', async (req, res) => {
  try {
    const insuranceData = req.body;
    const createdInsuranceRecord = await insuranceService.createInsurance(insuranceData);
    res.status(201).json(createdInsuranceRecord);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to get all insurance records
router.get('/', async (req, res) => {
    try {
      const { page, pageSize, sortField, sortOrder } = req.query;
      const data = await insuranceService.getInsurance({
        page: parseInt(page, 10) || 1,
        pageSize: parseInt(pageSize, 10) || 10,
        sortField: sortField || 'insuranceId',
        sortOrder: sortOrder || 'asc',
      });
      res.json(data);
    } catch (error) {
      console.error('Error fetching insurance records:', error);
      res.status(500).json({ message: 'Error fetching insurance records', error });
    }
  });

// Route to get a specific insurance record by ID
router.get('/:id', async (req, res) => {
  try {
    const insuranceId = req.params.id;
    const insuranceRecord = await insuranceService.getInsuranceById(insuranceId);
    res.status(200).json(insuranceRecord);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Route to update insurance record by ID
router.put('/:id', async (req, res) => {
  try {
    const insuranceId = req.params.id;
    const updateData = req.body;
    const updatedInsuranceRecord = await insuranceService.updateInsurance(insuranceId, updateData);
    res.status(200).json(updatedInsuranceRecord);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Route to delete an insurance record by ID
router.delete('/:id', async (req, res) => {
  try {
    const insuranceId = req.params.id;
    const deletedInsuranceRecord = await insuranceService.deleteInsurance(insuranceId);
    res.status(200).json(deletedInsuranceRecord);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

module.exports = router;
