const express = require('express');
const router = express.Router();
const parcelService = require('../services/parcelManagementService');

// Create a parcel
router.post('/', async (req, res) => {
  try {
    const parcel = await parcelService.createParcel(req.body);
    res.status(201).json(parcel);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all parcels
router.get('/', async (req, res) => {
  try {
    const parcels = await parcelService.getAllParcels();
    res.status(200).json(parcels);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a parcel by ID
router.get('/:id', async (req, res) => {
  try {
    const parcel = await parcelService.getParcelById(req.params.id);
    if (!parcel) {
      return res.status(404).json({ message: 'Parcel not found' });
    }
    res.status(200).json(parcel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a parcel
router.put('/:id', async (req, res) => {
  try {
    const updatedParcel = await parcelService.updateParcel(req.params.id, req.body);
    if (!updatedParcel) {
      return res.status(404).json({ message: 'Parcel not found' });
    }
    res.status(200).json(updatedParcel);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a parcel
router.delete('/:id', async (req, res) => {
  try {
    const deletedParcel = await parcelService.deleteParcel(req.params.id);
    if (!deletedParcel) {
      return res.status(404).json({ message: 'Parcel not found' });
    }
    res.status(200).json({ message: 'Parcel deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
