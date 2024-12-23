const VehicleRental = require('../models/VehicleRentalModel');

class VehicleRentalService {
  // Create a new vehicle rental record
  async createRental(data) {
    try {
      const newRental = new VehicleRental(data);
      return await newRental.save();
    } catch (error) {
      console.error('Error creating vehicle rental record:', error);
      throw error;
    }
  }

  // Get vehicle rental records with paging and sorting
  async getRentals({ page = 1, pageSize = 10, sortField = 'rentalDetails.startDate', sortOrder = 'desc' }) {
    try {
      const skip = (page - 1) * pageSize;
      const sortOptions = { [sortField]: sortOrder === 'asc' ? 1 : -1 };

      const records = await VehicleRental.find()
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(pageSize));

      const totalCount = await VehicleRental.countDocuments();

      return { records, totalCount };
    } catch (error) {
      console.error('Error fetching vehicle rental records:', error);
      throw error;
    }
  }

  // Search vehicle rentals by customer name, phone number, or vehicle ID
  async searchRentals({ searchQuery, page = 1, pageSize = 10 }) {
    try {
      const skip = (page - 1) * pageSize;
      const regex = new RegExp(searchQuery, 'i'); // Case-insensitive search

      const records = await VehicleRental.find({
        $or: [
          { 'customer.customerName': regex },
          { 'customer.contactNumber': regex },
          { vehicleId: regex },
        ],
      })
        .skip(skip)
        .limit(parseInt(pageSize));

      const totalCount = await VehicleRental.countDocuments({
        $or: [
          { 'customer.customerName': regex },
          { 'customer.contactNumber': regex },
          { vehicleId: regex },
        ],
      });

      return { records, totalCount };
    } catch (error) {
      console.error('Error searching vehicle rental records:', error);
      throw error;
    }
  }

  // Get a single vehicle rental record by ID
  async getRentalById(id) {
    try {
      return await VehicleRental.findById(id);
    } catch (error) {
      console.error('Error fetching vehicle rental record by ID:', error);
      throw error;
    }
  }

  // Update a vehicle rental record by ID
  async updateRental(id, data) {
    try {
      return await VehicleRental.findByIdAndUpdate(id, data, { new: true });
    } catch (error) {
      console.error('Error updating vehicle rental record:', error);
      throw error;
    }
  }

  // Delete a vehicle rental record by ID
  async deleteRental(id) {
    try {
      return await VehicleRental.findByIdAndDelete(id);
    } catch (error) {
      console.error('Error deleting vehicle rental record:', error);
      throw error;
    }
  }
}

module.exports = new VehicleRentalService();
