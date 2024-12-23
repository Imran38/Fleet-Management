const express = require('express');
const router = express.Router();
const customerService = require('../services/customerManagementService');

// Route to create a new customer
router.post('/', async (req, res) => {
  try {
    const customerData = req.body;
    const createdCustomer = await customerService.createCustomer(customerData);
    res.status(201).json(createdCustomer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to get all customers
router.get('/', async (req, res) => {
    try {
      const { page, pageSize, sortField, sortOrder } = req.query;
      const data = await customerService.getCustomers({ page, pageSize, sortField, sortOrder });
      res.json(data);
    } catch (error) {
      res.status(500).send({ message: 'Error fetching customers', error: error.message });
    }
  });

// Route to get a specific customer by ID
router.get('/:id', async (req, res) => {
  try {
    const customerId = req.params.id;
    const customer = await customerService.getCustomerById(customerId);
    res.status(200).json(customer);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Route to update a customer by ID
router.put('/:id', async (req, res) => {
  try {
    const customerId = req.params.id;
    const updateData = req.body;
    const updatedCustomer = await customerService.updateCustomer(customerId, updateData);
    res.status(200).json(updatedCustomer);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Route to delete a customer by ID
router.delete('/:id', async (req, res) => {
  try {
    const customerId = req.params.id;
    const deletedCustomer = await customerService.deleteCustomer(customerId);
    res.status(200).json(deletedCustomer);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

module.exports = router;
