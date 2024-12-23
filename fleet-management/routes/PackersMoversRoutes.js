const express = require('express');
const router = express.Router();
const packersMoversService = require('../services/PackersMoversService');

// Create a new Packers and Movers request
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const createdRequest = await packersMoversService.createPackersMovers(data);
    res.status(201).json(createdRequest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all Packers and Movers requests with paging and sorting
router.get('/', async (req, res) => {
  try {
    const { page, pageSize, sortField, sortOrder } = req.query;
    const result = await packersMoversService.getPackersMovers({ page, pageSize, sortField, sortOrder });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search Packers and Movers requests by customer name or phone number
router.get('/search', async (req, res) => {
  try {
    const { searchQuery, page, pageSize } = req.query;
    const result = await packersMoversService.searchPackersMovers({ searchQuery, page, pageSize });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single Packers and Movers request by ID
router.get('/:id', async (req, res) => {
  try {
    const request = await packersMoversService.getPackersMoversById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    res.json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a Packers and Movers request by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedRequest = await packersMoversService.updatePackersMovers(req.params.id, req.body);
    if (!updatedRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }
    res.json(updatedRequest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a Packers and Movers request by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedRequest = await packersMoversService.deletePackersMovers(req.params.id);
    if (!deletedRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
