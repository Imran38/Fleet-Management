const express = require('express');
const router = express.Router();
const tripManagementService = require('../services/tripManagementService');

// Route to create a new trip
router.post('/', async (req, res) => {
  try {
    const tripData = req.body;
    const createdTrip = await tripManagementService.createTrip(tripData);
    res.status(201).json(createdTrip);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
    try {
      const { page, pageSize, sortField, sortOrder } = req.query;
      const data = await tripManagementService.getTrips({ page, pageSize, sortField, sortOrder });
      res.json(data);
    } catch (error) {
      res.status(500).send({ message: 'Error fetching trips', error: error.message });
    }
});

// Route to get a specific trip by ID
router.get('/:id', async (req, res) => {
  try {
    const tripId = req.params.id;
    const trip = await tripManagementService.getTripById(tripId);
    res.status(200).json(trip);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Route to update a trip by ID
router.put('/:id', async (req, res) => {
  try {
    const tripId = req.params.id;
    const updateData = req.body;
    const updatedTrip = await tripManagementService.updateTrip(tripId, updateData);
    res.status(200).json(updatedTrip);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.put('/:id/geolocation', async (req, res) => {
  try {
    const { id: tripId } = req.params;
    const { driverId, latitude, longitude } = req.body;

    // Ensure required fields are provided
    if (!driverId || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ error: 'driverId, latitude, and longitude are required.' });
    }

    // Call the service method
    const updatedTrip = await tripManagementService.updateTripGeolocation(tripId, driverId, latitude, longitude);

    res.status(200).json(updatedTrip);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to delete a trip by ID
router.delete('/:id', async (req, res) => {
  try {
    const tripId = req.params.id;
    const deletedTrip = await tripManagementService.deleteTrip(tripId);
    res.status(200).json(deletedTrip);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

module.exports = router;
