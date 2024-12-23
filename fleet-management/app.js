const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
const path = require("path");

// Import module routes
const fleetManagementRoutes = require('./routes/fleetManagementRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const driverRoutes = require('./routes/driverRoutes');
const dispatchManagementRoutes = require('./routes/dispatchManagementRoutes');
const customerManagementRoutes = require('./routes/customerManagementRoutes');
const billingRoutes = require('./routes/billingRoutes');
const complianceRoutes = require('./routes/complianceRoutes');
const reportingRoutes = require('./routes/reportingRoutes');
const routeRoutes = require('./routes/routeRoutes');
const tripManagementRoutes = require('./routes/tripManagementRoutes');
const userManagementRoutes = require('./routes/userManagementRoutes');
const fuelManagementRoutes = require('./routes/fuelManagementRoutes');
const insuranceRoutes = require('./routes/insuranceRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const maintenanceRoutes = require('./routes/maintenanceRoutes');
const alertsRoutes = require('./routes/alertsRoutes');
const authRoutes = require("./routes/authRoutes");
const parcelRoutes = require('./routes/parcelManagementRoutes');
const packersMoversRoutes = require('./routes/PackersMoversRoutes');
const vehicleRentalRoutes = require('./routes/VehicleRentalRoutes');
const usedCarSalesRoutes = require('./routes/UsedCarSalesRoutes');


const app = express();


// Middleware
app.use(express.json());

//enable cros
app.use(cors());


const bodyParser = require('body-parser');

// Middleware
app.use(bodyParser.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const fleetAnalyticsRoutes = require('./routes/fleetAnalyticsRoutes');

// Register routes
app.use('/api/fleet', fleetManagementRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/dispatch', dispatchManagementRoutes);
app.use('/api/customers', customerManagementRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/compliance', complianceRoutes);
app.use('/api/reporting', reportingRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/trips', tripManagementRoutes);
app.use('/api/users', userManagementRoutes);
app.use('/api/fuel', fuelManagementRoutes);
app.use('/api/insurance', insuranceRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/analytics', fleetAnalyticsRoutes);
app.use('/api/alerts', alertsRoutes);
app.use("/api/auth", authRoutes);
app.use('/api/parcels', parcelRoutes);
app.use('/api/packersmovers', packersMoversRoutes);
app.use('/api/vehiclerentals', vehicleRentalRoutes);
app.use('/api/usedcarsales', usedCarSalesRoutes);

// MongoDB connection
mongoose.connect('mongodb://0.0.0.0:27017/fleet_management_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Failed to connect to MongoDB', error));

// Start the server
const PORT = process.env.PORT || 3000;

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // Optionally, perform cleanup or exit the process gracefully
  // process.exit(1);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
