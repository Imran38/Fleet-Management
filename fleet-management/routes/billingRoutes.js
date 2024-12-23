const express = require('express');
const router = express.Router();
const billingService = require('../services/billingService');

// Route to create a new billing record
router.post('/', async (req, res) => {
  try {
    const billingData = req.body;
    const createdBilling = await billingService.createBilling(billingData);
    res.status(201).json(createdBilling);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to get all billing records
router.get('/', async (req, res) => {
  try {
    const { page, pageSize, sortField, sortOrder } = req.query;
    const data = await billingService.getBilling({
      page: parseInt(page, 10) || 1,
      pageSize: parseInt(pageSize, 10) || 10,
      sortField: sortField || 'billingId',
      sortOrder: sortOrder || 'asc',
    });
    res.json(data);
  } catch (error) {
    console.error('Error fetching billing records:', error);
    res.status(500).json({ message: 'Error fetching billing records', error });
  }
});

// Route to get a specific billing record by ID
router.get('/:id', async (req, res) => {
  try {
    const billingId = req.params.id;
    const billingRecord = await billingService.getBillingById(billingId);
    res.status(200).json(billingRecord);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Route to update a billing record by ID
router.put('/:id', async (req, res) => {
  try {
    const billingId = req.params.id;
    const updateData = req.body;
    const updatedBilling = await billingService.updateBilling(billingId, updateData);
    res.status(200).json(updatedBilling);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Route to delete a billing record by ID
router.delete('/:id', async (req, res) => {
  try {
    const billingId = req.params.id;
    const deletedBilling = await billingService.deleteBilling(billingId);
    res.status(200).json(deletedBilling);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

module.exports = router;
