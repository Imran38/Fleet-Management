const express = require('express');
const router = express.Router();
const usedCarSalesService = require('../services/UsedCarSalesService');

// Create a new used car sales record
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const createdCar = await usedCarSalesService.createUsedCar(data);
    res.status(201).json(createdCar);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get used car sales records with paging and sorting
router.get('/', async (req, res) => {
  try {
    const { page, pageSize, sortField, sortOrder } = req.query;
    const result = await usedCarSalesService.getUsedCars({ page, pageSize, sortField, sortOrder });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search used cars by vehicle ID, make, model, or year
router.get('/search', async (req, res) => {
  try {
    const { searchQuery, page, pageSize } = req.query;
    const result = await usedCarSalesService.searchUsedCars({ searchQuery, page, pageSize });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single used car record by ID
router.get('/:id', async (req, res) => {
  try {
    const car = await usedCarSalesService.getUsedCarById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Car record not found' });
    }
    res.json(car);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a used car record by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedCar = await usedCarSalesService.updateUsedCar(req.params.id, req.body);
    if (!updatedCar) {
      return res.status(404).json({ message: 'Car record not found' });
    }
    res.json(updatedCar);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a used car record by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedCar = await usedCarSalesService.deleteUsedCar(req.params.id);
    if (!deletedCar) {
      return res.status(404).json({ message: 'Car record not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
