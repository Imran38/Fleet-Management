const express = require('express');
const router = express.Router();
const dispatchService = require('../services/dispatchManagementService');

// Route to create a new dispatch record
router.post('/', async (req, res) => {
  try {
    const dispatchData = req.body;
    const createdDispatch = await dispatchService.createDispatch(dispatchData);
    res.status(201).json(createdDispatch);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to get all dispatch records
router.get('/', async (req, res) => {
  try {
    const { page, pageSize, sortField, sortOrder } = req.query;
    const data = await dispatchService.getDispatches({
      page: parseInt(page, 10) || 1,
      pageSize: parseInt(pageSize, 10) || 10,
      sortField: sortField || 'dispatchId',
      sortOrder: sortOrder || 'asc',
    });
    res.json(data);
  } catch (error) {
    console.error('Error fetching dispatch records:', error);
    res.status(500).json({ message: 'Error fetching dispatch records', error });
  }
});

// Route to get a specific dispatch record by ID
router.get('/:id', async (req, res) => {
  try {
    const dispatchId = req.params.id;
    const dispatchRecord = await dispatchService.getDispatchRecordById(dispatchId);
    res.status(200).json(dispatchRecord);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Route to update a dispatch record by ID
router.put('/:id', async (req, res) => {
  try {
    const dispatchId = req.params.id;
    const updateData = req.body;
    const updatedDispatch = await dispatchService.updateDispatchRecord(dispatchId, updateData);
    res.status(200).json(updatedDispatch);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Route to delete a dispatch record by ID
router.delete('/:id', async (req, res) => {
  try {
    const dispatchId = req.params.id;
    const deletedDispatch = await dispatchService.deleteDispatchRecord(dispatchId);
    res.status(200).json(deletedDispatch);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

module.exports = router;
