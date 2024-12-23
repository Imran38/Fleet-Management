const express = require('express');
const router = express.Router();
const vehicleRentalService = require('../services/VehicleRentalService');

// Create a new vehicle rental record
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const createdRental = await vehicleRentalService.createRental(data);
    res.status(201).json(createdRental);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get vehicle rental records with paging and sorting
router.get('/', async (req, res) => {
  try {
    const { page, pageSize, sortField, sortOrder } = req.query;
    const result = await vehicleRentalService.getRentals({ page, pageSize, sortField, sortOrder });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search vehicle rentals by customer name, phone number, or vehicle ID
router.get('/search', async (req, res) => {
  try {
    const { searchQuery, page, pageSize } = req.query;
    const result = await vehicleRentalService.searchRentals({ searchQuery, page, pageSize });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single vehicle rental record by ID
router.get('/:id', async (req, res) => {
  try {
    const rental = await vehicleRentalService.getRentalById(req.params.id);
    if (!rental) {
      return res.status(404).json({ message: 'Rental record not found' });
    }
    res.json(rental);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a vehicle rental record by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedRental = await vehicleRentalService.updateRental(req.params.id, req.body);
    if (!updatedRental) {
      return res.status(404).json({ message: 'Rental record not found' });
    }
    res.json(updatedRental);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a vehicle rental record by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedRental = await vehicleRentalService.deleteRental(req.params.id);
    if (!deletedRental) {
      return res.status(404).json({ message: 'Rental record not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
