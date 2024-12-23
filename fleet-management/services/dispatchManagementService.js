const Dispatch = require('../models/dispatchManagementModel');

// Create a new dispatch
async function createDispatch(dispatchData) {
  try {
    const dispatch = new Dispatch(dispatchData);
    const savedDispatch = await dispatch.save();
    return savedDispatch;
  } catch (error) {
    throw new Error(`Error creating dispatch: ${error.message}`);
  }
}

// Get all dispatches
async function getAllDispatches() {
  try {
    const dispatches = await Dispatch.find();
    return dispatches;
  } catch (error) {
    throw new Error(`Error retrieving dispatches: ${error.message}`);
  }
}

async function getDispatches({ page, pageSize, sortField, sortOrder }) {
  const skip = (page - 1) * pageSize;
  const sort = { [sortField]: sortOrder === 'asc' ? 1 : -1 };
  const totalCount = await Dispatch.countDocuments();
  const dispatches = await Dispatch.find().sort(sort).skip(skip).limit(pageSize);
  return { totalCount, dispatches };
}

// Get a specific dispatch by ID
async function getDispatchById(dispatchId) {
  try {
    const dispatch = await Dispatch.findById(dispatchId);
    if (!dispatch) {
      throw new Error(`Dispatch with ID ${dispatchId} not found`);
    }
    return dispatch;
  } catch (error) {
    throw new Error(`Error retrieving dispatch: ${error.message}`);
  }
}

// Update a dispatch by ID
async function updateDispatch(dispatchId, updateData) {
  try {
    const updatedDispatch = await Dispatch.findByIdAndUpdate(dispatchId, updateData, {
      new: true,
      runValidators: true,
    });
    if (!updatedDispatch) {
      throw new Error(`Dispatch with ID ${dispatchId} not found`);
    }
    return updatedDispatch;
  } catch (error) {
    throw new Error(`Error updating dispatch: ${error.message}`);
  }
}

// Delete a dispatch by ID
async function deleteDispatch(dispatchId) {
  try {
    const deletedDispatch = await Dispatch.findByIdAndDelete(dispatchId);
    if (!deletedDispatch) {
      throw new Error(`Dispatch with ID ${dispatchId} not found`);
    }
    return deletedDispatch;
  } catch (error) {
    throw new Error(`Error deleting dispatch: ${error.message}`);
  }
}

module.exports = {
  createDispatch,
  getAllDispatches,
  getDispatchById,
  updateDispatch,
  deleteDispatch,
  getDispatches,
};
