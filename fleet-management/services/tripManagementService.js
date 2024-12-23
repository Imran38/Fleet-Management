const Trip = require('../models/tripManagementModel');

// Create a new trip
async function createTrip(tripData) {
  try {
    const trip = new Trip(tripData);
    const savedTrip = await trip.save();
    return savedTrip;
  } catch (error) {
    throw new Error(`Error creating trip: ${error.message}`);
  }
}

// Get all trips
async function getAllTrips() {
  try {
    const trips = await Trip.find();
    return trips;
  } catch (error) {
    throw new Error(`Error retrieving trips: ${error.message}`);
  }
}
// get trips
async function getTrips({ page = 1, pageSize = 5, sortField = 'tripId', sortOrder = 'asc' }) {
    const skip = (page - 1) * pageSize;
    const sortOptions = { [sortField]: sortOrder === 'asc' ? 1 : -1 };
  
    const trips = await Trip.find().sort(sortOptions).skip(skip).limit(parseInt(pageSize, 10));
    const totalCount = await Trip.countDocuments();
  
    return { trips, totalCount };
}

// Get a specific trip by ID
async function getTripById(tripId) {
  try {
    const trip = await Trip.findById(tripId);
    if (!trip) {
      throw new Error(`Trip with ID ${tripId} not found`);
    }
    return trip;
  } catch (error) {
    throw new Error(`Error retrieving trip: ${error.message}`);
  }
}

// Update a trip by ID
async function updateTrip(tripId, updateData) {
  try {
    const updatedTrip = await Trip.findByIdAndUpdate(tripId, updateData, {
      new: true,
      runValidators: true,
    });
    if (!updatedTrip) {
      throw new Error(`Trip with ID ${tripId} not found`);
    }
    return updatedTrip;
  } catch (error) {
    throw new Error(`Error updating trip: ${error.message}`);
  }
}

// Delete a trip by ID
async function deleteTrip(tripId) {
  try {
    const deletedTrip = await Trip.findByIdAndDelete(tripId);
    if (!deletedTrip) {
      throw new Error(`Trip with ID ${tripId} not found`);
    }
    return deletedTrip;
  } catch (error) {
    throw new Error(`Error deleting trip: ${error.message}`);
  }
}

async function updateTripGeolocation(tripId, driverId, latitude, longitude) {
  try {
    // Find the trip by tripId and driverId to ensure the correct driver is updating the trip
    const trip = await TripManagement.findOne({ tripId, driverId });
    if (!trip) {
      throw new Error('Trip not found or driver mismatch.');
    }

    // Append the new geolocation data
    trip.geoLocation.push({ latitude, longitude });

    // Save the updated trip
    const updatedTrip = await trip.save();
    return updatedTrip;
  } catch (error) {
    console.error('Error updating trip geolocation:', error);
    throw new Error('Failed to update trip geolocation.');
  }
}

module.exports = {
  createTrip,
  getAllTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  getTrips,
  updateTripGeolocation,
};
