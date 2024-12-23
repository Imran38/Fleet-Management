const Billing = require('../models/billingModel');

// Create a new billing entry
async function createBilling(billingData) {
  try {
    const billing = new Billing(billingData);
    const savedBilling = await billing.save();
    return savedBilling;
  } catch (error) {
    throw new Error(`Error creating billing: ${error.message}`);
  }
}

// Get all billing entries
async function getAllBillings() {
  try {
    const billings = await Billing.find();
    return billings;
  } catch (error) {
    throw new Error(`Error retrieving billing entries: ${error.message}`);
  }
}

async function getBilling({ page, pageSize, sortField, sortOrder }) {
  const skip = (page - 1) * pageSize;
  const sortOptions = { [sortField]: sortOrder === 'asc' ? 1 : -1 };

  const [records, totalCount] = await Promise.all([
    Billing.find().sort(sortOptions).skip(skip).limit(pageSize),
    Billing.countDocuments(),
  ]);

  return { records, totalCount };
}

// Get a specific billing entry by ID
async function getBillingById(billingId) {
  try {
    const billing = await Billing.findOne({billingId});
    if (!billing) {
      throw new Error(`Billing entry with ID ${billingId} not found`);
    }
    return billing;
  } catch (error) {
    throw new Error(`Error retrieving billing entry: ${error.message}`);
  }
}

// Update a billing entry by ID
async function updateBilling(billingId, updateData) {
  try {
    const updatedBilling = await Billing.findOneAndUpdate({billingId}, updateData, {
      new: true,
      runValidators: true,
    });
    if (!updatedBilling) {
      throw new Error(`Billing entry with ID ${billingId} not found`);
    }
    return updatedBilling;
  } catch (error) {
    throw new Error(`Error updating billing entry: ${error.message}`);
  }
}

// Delete a billing entry by ID
async function deleteBilling(billingId) {
  try {
    const deletedBilling = await Billing.findOneAndDelete({billingId});
    if (!deletedBilling) {
      throw new Error(`Billing entry with ID ${billingId} not found`);
    }
    return deletedBilling;
  } catch (error) {
    throw new Error(`Error deleting billing entry: ${error.message}`);
  }
}

module.exports = {
  createBilling,
  getAllBillings,
  getBillingById,
  updateBilling,
  deleteBilling,
  getBilling,
};
