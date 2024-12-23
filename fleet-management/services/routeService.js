const Route = require('../models/routeModel');

// Create a new route
async function createRoute(routeData) {
  try {
    const route = new Route(routeData);
    const savedRoute = await route.save();
    return savedRoute;
  } catch (error) {
    throw new Error(`Error creating route: ${error.message}`);
  }
}

async function getRoutes({ page = 1, pageSize = 5, sortField = 'routeId', sortOrder = 'asc' }) {
    try {
      const skip = (page - 1) * pageSize;
      const sortOptions = { [sortField]: sortOrder === 'asc' ? 1 : -1 };
  
      const routes = await Route.find()
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(pageSize, 10));
  
      const totalCount = await Route.countDocuments();
  
      return {
        routes,
        totalCount,
      };
    } catch (error) {
      throw new Error('Error fetching routes: ' + error.message);
    }
  }

// Get all routes
async function getAllRoutes() {
  try {
    const routes = await Route.find();
    return routes;
  } catch (error) {
    throw new Error(`Error retrieving routes: ${error.message}`);
  }
}

// Get a specific route by ID
async function getRouteById(routeId) {
  try {
    const route = await Route.findById(routeId);
    if (!route) {
      throw new Error(`Route with ID ${routeId} not found`);
    }
    return route;
  } catch (error) {
    throw new Error(`Error retrieving route: ${error.message}`);
  }
}

// Update a route by ID
async function updateRoute(routeId, updateData) {
  try {
    const updatedRoute = await Route.findByIdAndUpdate(routeId, updateData, {
      new: true,
      runValidators: true,
    });
    if (!updatedRoute) {
      throw new Error(`Route with ID ${routeId} not found`);
    }
    return updatedRoute;
  } catch (error) {
    throw new Error(`Error updating route: ${error.message}`);
  }
}

// Delete a route by ID
async function deleteRoute(routeId) {
  try {
    const deletedRoute = await Route.findByIdAndDelete(routeId);
    if (!deletedRoute) {
      throw new Error(`Route with ID ${routeId} not found`);
    }
    return deletedRoute;
  } catch (error) {
    throw new Error(`Error deleting route: ${error.message}`);
  }
}

module.exports = {
  createRoute,
  getAllRoutes,
  getRouteById,
  updateRoute,
  deleteRoute,
  getRoutes,
};
