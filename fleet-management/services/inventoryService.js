const Inventory = require('../models/inventoryModel');

// Create a new inventory item
async function createInventoryItem(inventoryData) {
  try {
    const inventory = new Inventory(inventoryData);
    const savedInventory = await inventory.save();
    return savedInventory;
  } catch (error) {
    throw new Error(`Error creating inventory item: ${error.message}`);
  }
}

// Get all inventory items
async function getAllInventoryItems() {
  try {
    const inventoryItems = await Inventory.find();
    return inventoryItems;
  } catch (error) {
    throw new Error(`Error retrieving inventory items: ${error.message}`);
  }
}

async function getInventory({ page, pageSize, sortField, sortOrder }) {
  const skip = (page - 1) * pageSize;
  const sortOptions = { [sortField]: sortOrder === 'asc' ? 1 : -1 };

  const [records, totalCount] = await Promise.all([
    Inventory.find().sort(sortOptions).skip(skip).limit(pageSize),
    Inventory.countDocuments(),
  ]);

  return { records, totalCount };
}

// Get a specific inventory item by ID
async function getInventoryItemById(itemId) {
  try {
    const inventoryItem = await Inventory.findOne({itemId});
    if (!inventoryItem) {
      throw new Error(`Inventory item with ID ${itemId} not found`);
    }
    return inventoryItem;
  } catch (error) {
    throw new Error(`Error retrieving inventory item: ${error.message}`);
  }
}

// Update an inventory item by ID
async function updateInventoryItem(itemId, updateData) {
  try {
    const updatedInventoryItem = await Inventory.findOneAndUpdate({itemId}, updateData, {
      new: true,
      runValidators: true,
    });
    if (!updatedInventoryItem) {
      throw new Error(`Inventory item with ID ${itemId} not found`);
    }
    return updatedInventoryItem;
  } catch (error) {
    throw new Error(`Error updating inventory item: ${error.message}`);
  }
}

// Delete an inventory item by ID
async function deleteInventoryItem(itemId) {
  try {    
    const deletedInventoryItem = await Inventory.findOneAndDelete({itemId});
    if (!deletedInventoryItem) {
      throw new Error(`Inventory item with ID ${itemId} not found`);
    }
    return deletedInventoryItem;
  } catch (error) {
    throw new Error(`Error deleting inventory item: ${error.message}`);
  }
}

module.exports = {
  createInventoryItem,
  getAllInventoryItems,
  getInventoryItemById,
  updateInventoryItem,
  deleteInventoryItem,
  getInventory,
};
