const UsedCar = require('../models/UsedCarSalesModel');

class UsedCarSalesService {
  // Create a new used car sales record
  async createUsedCar(data) {
    try {
      const newCar = new UsedCar(data);
      return await newCar.save();
    } catch (error) {
      console.error('Error creating used car record:', error);
      throw error;
    }
  }

  // Get used car sales records with paging and sorting
  async getUsedCars({ page = 1, pageSize = 10, sortField = 'listedDate', sortOrder = 'desc' }) {
    try {
      const skip = (page - 1) * pageSize;
      const sortOptions = { [sortField]: sortOrder === 'asc' ? 1 : -1 };

      const records = await UsedCar.find()
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(pageSize));

      const totalCount = await UsedCar.countDocuments();

      return { records, totalCount };
    } catch (error) {
      console.error('Error fetching used car records:', error);
      throw error;
    }
  }

  // Search used cars by vehicle ID, make, model, or year
  async searchUsedCars({ searchQuery, page = 1, pageSize = 10 }) {
    try {
      const skip = (page - 1) * pageSize;
      const regex = new RegExp(searchQuery, 'i'); // Case-insensitive search

      const records = await UsedCar.find({
        $or: [
          { vehicleId: regex },
          { make: regex },
          { model: regex },
          { year: regex },
        ],
      })
        .skip(skip)
        .limit(parseInt(pageSize));

      const totalCount = await UsedCar.countDocuments({
        $or: [
          { vehicleId: regex },
          { make: regex },
          { model: regex },
          { year: regex },
        ],
      });

      return { records, totalCount };
    } catch (error) {
      console.error('Error searching used car records:', error);
      throw error;
    }
  }

  // Get a single used car record by ID
  async getUsedCarById(id) {
    try {
      return await UsedCar.findById(id);
    } catch (error) {
      console.error('Error fetching used car record by ID:', error);
      throw error;
    }
  }

  // Update a used car record by ID
  async updateUsedCar(id, data) {
    try {
      return await UsedCar.findByIdAndUpdate(id, data, { new: true });
    } catch (error) {
      console.error('Error updating used car record:', error);
      throw error;
    }
  }

  // Delete a used car record by ID
  async deleteUsedCar(id) {
    try {
      return await UsedCar.findByIdAndDelete(id);
    } catch (error) {
      console.error('Error deleting used car record:', error);
      throw error;
    }
  }
}

module.exports = new UsedCarSalesService();
