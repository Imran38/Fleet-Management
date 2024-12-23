const Compliance = require('../models/complianceModel');

// Create a new compliance entry
async function createCompliance(complianceData) {
  try {
    const compliance = new Compliance(complianceData);
    const savedCompliance = await compliance.save();
    return savedCompliance;
  } catch (error) {
    throw new Error(`Error creating compliance: ${error.message}`);
  }
}

// Get all compliance entries
async function getAllCompliances() {
  try {
    const compliances = await Compliance.find();
    return compliances;
  } catch (error) {
    throw new Error(`Error retrieving compliance entries: ${error.message}`);
  }
}

async function getCompliance({ page, pageSize, sortField, sortOrder }) {
  const skip = (page - 1) * pageSize;
  const sort = { [sortField]: sortOrder === 'asc' ? 1 : -1 };
  const totalCount = await Compliance.countDocuments();
  const records = await Compliance.find().sort(sort).skip(skip).limit(pageSize);
  return { totalCount, records };
}

// Get a specific compliance entry by ID
async function getComplianceById(complianceId) {
  try {
    const compliance = await Compliance.findOne({complianceId});
    if (!compliance) {
      throw new Error(`Compliance entry with ID ${complianceId} not found`);
    }
    return compliance;
  } catch (error) {
    throw new Error(`Error retrieving compliance entry: ${error.message}`);
  }
}

// Update a compliance entry by ID
async function updateCompliance(complianceId, updateData) {
  try {
    const updatedCompliance = await Compliance.findOneAndUpdate({complianceId}, updateData, {
      new: true,
      runValidators: true,
    });
    if (!updatedCompliance) {
      throw new Error(`Compliance entry with ID ${complianceId} not found`);
    }
    return updatedCompliance;
  } catch (error) {
    throw new Error(`Error updating compliance entry: ${error.message}`);
  }
}

// Delete a compliance entry by ID
async function deleteCompliance(complianceId) {
  try {
    const deletedCompliance = await Compliance.findOneAndDelete({complianceId});
    if (!deletedCompliance) {
      throw new Error(`Compliance entry with ID ${complianceId} not found`);
    }
    return deletedCompliance;
  } catch (error) {
    throw new Error(`Error deleting compliance entry: ${error.message}`);
  }
}

module.exports = {
  createCompliance,
  getAllCompliances,
  getComplianceById,
  updateCompliance,
  deleteCompliance,
  getCompliance,
};
