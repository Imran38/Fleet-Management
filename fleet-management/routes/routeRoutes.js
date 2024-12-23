const express = require('express');
const router = express.Router();
const routeService = require('../services/routeService');

// Route to create a new route record
router.post('/', async (req, res) => {
  try {
    const routeData = req.body;
    const createdRoute = await routeService.createRoute(routeData);
    res.status(201).json(createdRoute);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to get all route records
router.get('/', async (req, res) => {
    try {
      const { page, pageSize, sortField, sortOrder } = req.query;
  
      // Fetch paginated and sorted routes
      const data = await routeService.getRoutes({
        page: parseInt(page, 10),
        pageSize: parseInt(pageSize, 10),
        sortField,
        sortOrder,
      });
  
      res.json(data);
    } catch (error) {
      res.status(500).send({
        message: 'Error fetching routes',
        error: error.message,
      });
    }
  });

// Route to get a specific route record by ID
router.get('/:id', async (req, res) => {
  try {
    const routeId = req.params.id;
    const route = await routeService.getRouteById(routeId);
    res.status(200).json(route);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Route to update a route record by ID
router.put('/:id', async (req, res) => {
  try {
    const routeId = req.params.id;
    const updateData = req.body;
    const updatedRoute = await routeService.updateRoute(routeId, updateData);
    res.status(200).json(updatedRoute);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Route to delete a route record by ID
router.delete('/:id', async (req, res) => {
  try {
    const routeId = req.params.id;
    const deletedRoute = await routeService.deleteRoute(routeId);
    res.status(200).json(deletedRoute);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

module.exports = router;
