const express = require('express');
const router = express.Router();
const userManagementService = require('../services/userManagementService');

// Route to create a new user
router.post('/', async (req, res) => {
  try {
    const userData = req.body;
    const createdUser = await userManagementService.createUser(userData);
    res.status(201).json(createdUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to get all users
router.get('/', async (req, res) => {
    try {
      const { page, pageSize, sortField, sortOrder } = req.query;
      const data = await userManagementService.getUsers({
        page: parseInt(page, 10) || 1,
        pageSize: parseInt(pageSize, 10) || 10,
        sortField: sortField || 'userId',
        sortOrder: sortOrder || 'asc',
      });
      res.json(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Error fetching users', error });
    }
  });

// Route to get a specific user by ID
router.get('/:id', async (req, res) => {
  try {
    const userId = req.params.id;   
    const user = await userManagementService.getUserById(userId);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Route to update a user by ID
router.put('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const updateData = req.body;
    const updatedUser = await userManagementService.updateUser(userId, updateData);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Route to delete a user by ID
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await userManagementService.deleteUser(userId);
    res.status(200).json(deletedUser);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

module.exports = router;
