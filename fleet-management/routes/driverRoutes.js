const express = require("express");
const multer = require("multer");
const router = express.Router();
const driverService = require("../services/driverService");

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"), // Ensure 'uploads/' directory exists
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// Route to create a new driver
router.post(
  "/",
  upload.single("image"), // Handle single file upload for 'image'
  async (req, res) => {
    try {
      const driverData = {
        ...req.body,
        image: req.file ? req.file.path : null, // Include the image path if uploaded
      };
      const createdDriver = await driverService.createDriver(driverData);
      res.status(201).json(createdDriver);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Route to update a driver by ID
router.put(
  "/:id",
  upload.single("image"), // Handle single file upload for 'image'
  async (req, res) => {
    try {     
      const driverId = req.params.id;
      const updateData = {
        ...req.body,
        image: req.file ? req.file.path : undefined, // Include the image path if uploaded
      };    
      const updatedDriver = await driverService.updateDriver(driverId, updateData);
      if (!updatedDriver) {
        return res.status(404).json({ message: "Driver not found" });
      }
      res.status(200).json(updatedDriver);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);


// Route to get all drivers
router.get('/', async (req, res) => {
    try {
      const { page, pageSize, sortField, sortOrder } = req.query;
      const data = await driverService.getDrivers({ page, pageSize, sortField, sortOrder });
      res.json(data);
    } catch (error) {
      res.status(500).send({ message: 'Error fetching drivers', error });
    }
});

// Route to get a specific driver by ID
router.get('/:id', async (req, res) => {
  try {
    const driverId = req.params.id;
    const driver = await driverService.getDriverById(driverId);
    res.status(200).json(driver);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});


// Route to delete a driver by ID
router.delete('/:id', async (req, res) => {
  try {
    const driverId = req.params.id;
    const deletedDriver = await driverService.deleteDriver(driverId);
    res.status(200).json(deletedDriver);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

module.exports = router;
