const Insurance = require('../models/insuranceModel');

// Create a new insurance policy
async function createInsurance(insuranceData) {
  try {
    const insurance = new Insurance(insuranceData);
    const savedInsurance = await insurance.save();
    return savedInsurance;
  } catch (error) {
    throw new Error(`Error creating insurance: ${error.message}`);
  }
}

// Get all insurance policies
async function getAllInsurance() {
  try {
    const insurances = await Insurance.find();
    return insurances;
  } catch (error) {
    throw new Error(`Error retrieving insurance policies: ${error.message}`);
  }
}

async function getInsurance({ page, pageSize, sortField, sortOrder }) {
    const skip = (page - 1) * pageSize;
    const sortOptions = { [sortField]: sortOrder === 'asc' ? 1 : -1 };
  
    const [records, totalCount] = await Promise.all([
      Insurance.find().sort(sortOptions).skip(skip).limit(pageSize),
      Insurance.countDocuments(),
    ]);
  
    return { records, totalCount };
  }

// Get a specific insurance policy by ID
async function getInsuranceById(insuranceId) {
  try {
    const insurance = await Insurance.findOne({insuranceId});
    if (!insurance) {
      throw new Error(`Insurance policy with ID ${insuranceId} not found`);
    }
    return insurance;
  } catch (error) {
    throw new Error(`Error retrieving insurance policy: ${error.message}`);
  }
}

// Update an insurance policy by ID
async function updateInsurance(insuranceId, updateData) {
  try {
    const updatedInsurance = await Insurance.findOneAndUpdate({insuranceId}, updateData, {
      new: true,
      runValidators: true,
    });
    if (!updatedInsurance) {
      throw new Error(`Insurance policy with ID ${insuranceId} not found`);
    }
    return updatedInsurance;
  } catch (error) {
    throw new Error(`Error updating insurance policy: ${error.message}`);
  }
}

// Delete an insurance policy by ID
async function deleteInsurance(insuranceId) {
  try {
    const deletedInsurance = await Insurance.findOneAndDelete(insuranceId);
    if (!deletedInsurance) {
      throw new Error(`Insurance policy with ID ${insuranceId} not found`);
    }
    return deletedInsurance;
  } catch (error) {
    throw new Error(`Error deleting insurance policy: ${error.message}`);
  }
}

module.exports = {
  createInsurance,
  getAllInsurance,
  getInsuranceById,
  updateInsurance,
  deleteInsurance,
  getInsurance,
};
