const express = require("express");
const router = express.Router();
const vehicleService = require("../services/vehicleService");
const multer = require("multer");

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"), // Ensure 'uploads/' directory exists
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// Create a vehicle
router.post(
  "/",
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const vehicleData = {
        ...req.body,
        image1: req.files.image1 ? req.files.image1[0].path : null,
        image2: req.files.image2 ? req.files.image2[0].path : null,
        image3: req.files.image3 ? req.files.image3[0].path : null,
      };
      const vehicle = await vehicleService.createVehicle(vehicleData);
      res.status(201).json(vehicle);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Get all vehicles
router.get('/', async (req, res) => {
    try {
      const { page, pageSize, sortField, sortOrder, search } = req.query;
      const data = await vehicleService.getVehicles({ page, pageSize, sortField, sortOrder, search });
      res.json(data);
    } catch (error) {
      res.status(500).send({ message: 'Error fetching vehicles', error });
    }
});

router.get('/all', async (req, res) => {
  try {
    const data = await vehicleService.getAllVehicles();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }  
});

// Get a vehicle by ID
router.get('/:id', async (req, res) => {
  try {
    const vehicle = await vehicleService.getVehicleById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.status(200).json(vehicle);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a vehicle
router.put(
  "/:id",
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      // Prepare data for updating the vehicle
      const vehicleData = {
        ...req.body,
        image1: req.files.image1 ? req.files.image1[0].path : undefined,
        image2: req.files.image2 ? req.files.image2[0].path : undefined,
        image3: req.files.image3 ? req.files.image3[0].path : undefined,
      };

      // Update the vehicle in the service layer
      const updatedVehicle = await vehicleService.updateVehicle(req.params.id, vehicleData);

      if (!updatedVehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }

      res.status(200).json(updatedVehicle);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Delete a vehicle
router.delete('/:id', async (req, res) => {
  try {
    const deletedVehicle = await vehicleService.deleteVehicle(req.params.id);
    if (!deletedVehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.status(200).json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
