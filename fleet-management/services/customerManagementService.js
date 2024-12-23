const Customer = require('../models/customerManagementModel');

// Create a new customer
async function createCustomer(customerData) {
  try {
    const customer = new Customer(customerData);
    const savedCustomer = await customer.save();
    return savedCustomer;
  } catch (error) {
    throw new Error(`Error creating customer: ${error.message}`);
  }
}

// Get all customers
async function getAllCustomers() {
  try {
    const customers = await Customer.find();
    return customers;
  } catch (error) {
    throw new Error(`Error retrieving customers: ${error.message}`);
  }
}

async function getCustomers({ page = 1, pageSize = 5, sortField = 'customerId', sortOrder = 'asc' }) {
    const skip = (page - 1) * pageSize;
    const sortOptions = { [sortField]: sortOrder === 'asc' ? 1 : -1 };
  
    const customers = await Customer.find().sort(sortOptions).skip(skip).limit(parseInt(pageSize, 10));
    const totalCount = await Customer.countDocuments();
  
    return { customers, totalCount };
  }

// Get a specific customer by ID
async function getCustomerById(customerId) {
  try {
    const customer = await Customer.findById(customerId);
    if (!customer) {
      throw new Error(`Customer with ID ${customerId} not found`);
    }
    return customer;
  } catch (error) {
    throw new Error(`Error retrieving customer: ${error.message}`);
  }
}

// Update a customer by ID
async function updateCustomer(customerId, updateData) {
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(customerId, updateData, {
      new: true,
      runValidators: true,
    });
    if (!updatedCustomer) {
      throw new Error(`Customer with ID ${customerId} not found`);
    }
    return updatedCustomer;
  } catch (error) {
    throw new Error(`Error updating customer: ${error.message}`);
  }
}

// Delete a customer by ID
async function deleteCustomer(customerId) {
  try {
    const deletedCustomer = await Customer.findByIdAndDelete(customerId);
    if (!deletedCustomer) {
      throw new Error(`Customer with ID ${customerId} not found`);
    }
    return deletedCustomer;
  } catch (error) {
    throw new Error(`Error deleting customer: ${error.message}`);
  }
}

module.exports = {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  getCustomers,
};
