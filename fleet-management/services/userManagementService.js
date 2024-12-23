const User = require('../models/userManagementModel');

// Create a new user
async function createUser(userData) {
  try {
    const user = new User(userData);
    const savedUser = await user.save();
    return savedUser;
  } catch (error) {
    throw new Error(`Error creating user: ${error.message}`);
  }
}

// Get all users
async function getAllUsers() {
  try {
    const users = await User.find();
    return users;
  } catch (error) {
    throw new Error(`Error retrieving users: ${error.message}`);
  }
}

async function getUsers({ page = 1, pageSize = 10, sortField = 'userId', sortOrder = 'asc' }) {
    const skip = (page - 1) * pageSize;
    const sort = { [sortField]: sortOrder === 'asc' ? 1 : -1 };
  
    const totalUsers = await User.countDocuments();
    const users = await User.find()
      .sort(sort)
      .skip(skip)
      .limit(pageSize);
  
    return {
      users,
      totalCount: totalUsers,
    };
  }
  

// Get a specific user by ID
async function getUserById(userId) {
  try {
    const user = await User.findOne({ userId });
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }
    return user;
  } catch (error) {
    throw new Error(`Error retrieving user: ${error.message}`);
  }
}

// Update a user by ID
async function updateUser(userId, updateData) {
  try {
    const updatedUser = await User.findOneAndUpdate({userId}, updateData, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser) {
      throw new Error(`User with ID ${userId} not found`);
    }
    return updatedUser;
  } catch (error) {
    throw new Error(`Error updating user: ${error.message}`);
  }
}

// Delete a user by ID
async function deleteUser(userId) {
  try {   
    const deletedUser = await User.findOneAndDelete({userId});
    if (!deletedUser) {
      throw new Error(`User with ID ${userId} not found`);
    }
    return deletedUser;
  } catch (error) {
    throw new Error(`Error deleting user: ${error.message}`);
  }
}

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUsers,
};
