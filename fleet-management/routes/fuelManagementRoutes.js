const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fuelManagementService = require('../services/fuelManagementService');


// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory for uploaded files
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

// Route to create a new fuel record
router.post('/', upload.single('receiptImage'), async (req, res) => {
  try {

   
    // Build fuel data object
    const fuelData = {
      ...req.body, 
      receiptImage: req.file ? req.file.filename : null, // Add uploaded image if present
    };

   
    // Call the service layer to create the fuel record
    const createdFuelRecord = await fuelManagementService.createFuelEntry(fuelData);
    res.status(201).json(createdFuelRecord);
  } catch (error) {
    console.error('Error creating fuel record:', error);
    res.status(500).json({ error: error.message });
  }
});



// Route to get all fuel records
router.get('/', async (req, res) => {
    try {
      const { page, pageSize, sortField, sortOrder } = req.query;
      const data = await fuelManagementService.getFuelEntries({
        page: parseInt(page, 10) || 1,
        pageSize: parseInt(pageSize, 10) || 10,
        sortField: sortField || 'recordId',
        sortOrder: sortOrder || 'asc',
      });
  
      res.json(data);
    } catch (error) {
      console.error('Error fetching fuel records:', error);
      res.status(500).json({ message: 'Error fetching fuel records', error });
    }
  });

// Route to get a specific fuel record by ID
router.get('/:id', async (req, res) => {
  try {
    const fuelId = req.params.id;
    const fuelRecord = await fuelManagementService.getFuelEntryById(fuelId);
    res.status(200).json(fuelRecord);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Route to update fuel record by ID
router.put('/:id', async (req, res) => {
  try {
    const fuelId = req.params.id;
    const updateData = req.body;
    const updatedFuelRecord = await fuelManagementService.updateFuelEntry(fuelId, updateData);
    res.status(200).json(updatedFuelRecord);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Route to delete a fuel record by ID
router.delete('/:id', async (req, res) => {
  try {
    const fuelId = req.params.id;
    const deletedFuelRecord = await fuelManagementService.deleteFuelEntry(fuelId);
    res.status(200).json(deletedFuelRecord);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

module.exports = router;
