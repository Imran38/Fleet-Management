const PackersMovers = require('../models/PackersMoversModel');

class PackersMoversService {
  // Create a new Packers and Movers request
  async createPackersMovers(data) {
    try {
      const newRequest = new PackersMovers(data);
      return await newRequest.save();
    } catch (error) {
      console.error('Error creating Packers and Movers request:', error);
      throw error;
    }
  }

  // Get all Packers and Movers requests with paging and sorting
  async getPackersMovers({ page = 1, pageSize = 10, sortField = 'requestDate', sortOrder = 'desc' }) {
    try {
      const skip = (page - 1) * pageSize;
      const sortOptions = { [sortField]: sortOrder === 'asc' ? 1 : -1 };

      const records = await PackersMovers.find()
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(pageSize));

      const totalCount = await PackersMovers.countDocuments();

      return { records, totalCount };
    } catch (error) {
      console.error('Error fetching Packers and Movers requests:', error);
      throw error;
    }
  }

  // Search Packers and Movers requests by customer name or phone number
  async searchPackersMovers({ searchQuery, page = 1, pageSize = 10 }) {
    try {
      const skip = (page - 1) * pageSize;
      const regex = new RegExp(searchQuery, 'i'); // Case-insensitive search

      const records = await PackersMovers.find({
        $or: [
          { 'customer.customerName': regex },
          { 'customer.contactNumber': regex },
        ],
      })
        .skip(skip)
        .limit(parseInt(pageSize));

      const totalCount = await PackersMovers.countDocuments({
        $or: [
          { 'customer.customerName': regex },
          { 'customer.contactNumber': regex },
        ],
      });

      return { records, totalCount };
    } catch (error) {
      console.error('Error searching Packers and Movers requests:', error);
      throw error;
    }
  }

  // Get a single Packers and Movers request by ID
  async getPackersMoversById(id) {
    try {
      return await PackersMovers.findById(id);
    } catch (error) {
      console.error('Error fetching Packers and Movers request by ID:', error);
      throw error;
    }
  }

  // Update a Packers and Movers request by ID
  async updatePackersMovers(id, data) {
    try {
      return await PackersMovers.findByIdAndUpdate(id, data, { new: true });
    } catch (error) {
      console.error('Error updating Packers and Movers request:', error);
      throw error;
    }
  }

  // Delete a Packers and Movers request by ID
  async deletePackersMovers(id) {
    try {
      return await PackersMovers.findByIdAndDelete(id);
    } catch (error) {
      console.error('Error deleting Packers and Movers request:', error);
      throw error;
    }
  }
}

module.exports = new PackersMoversService();
