const express = require('express');
const router = express.Router();
const inventoryService = require('../services/inventoryService');

// Route to create a new inventory record
router.post('/', async (req, res) => {
  try {
    const inventoryData = req.body;
    const createdInventoryRecord = await inventoryService.createInventoryItem(inventoryData);
    res.status(201).json(createdInventoryRecord);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to get all inventory records
router.get('/', async (req, res) => {
  try {
    const { page, pageSize, sortField, sortOrder } = req.query;
    const data = await inventoryService.getInventory({
      page: parseInt(page, 10) || 1,
      pageSize: parseInt(pageSize, 10) || 10,
      sortField: sortField || 'itemId',
      sortOrder: sortOrder || 'asc',
    });
    res.json(data);
  } catch (error) {
    console.error('Error fetching inventory records:', error);
    res.status(500).json({ message: 'Error fetching inventory records', error });
  }
});

// Route to get a specific inventory record by ID
router.get('/:id', async (req, res) => {
  try {
    const inventoryId = req.params.id;
    const inventoryRecord = await inventoryService.getInventoryItemById(inventoryId);
    res.status(200).json(inventoryRecord);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Route to update an inventory record by ID
router.put('/:id', async (req, res) => {
  try {
    const inventoryId = req.params.id;
    const updateData = req.body;
    const updatedInventoryRecord = await inventoryService.updateInventoryItem(inventoryId, updateData);
    res.status(200).json(updatedInventoryRecord);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Route to delete an inventory record by ID
router.delete('/:id', async (req, res) => {
  try {
    const inventoryId = req.params.id;
    const deletedInventoryRecord = await inventoryService.deleteInventoryItem(inventoryId);
    res.status(200).json(deletedInventoryRecord);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

module.exports = router;
