const mongoose = require('mongoose');

const ReportingSchema = new mongoose.Schema({
  reportId: String,
  reportType: String, // e.g., Trip Report, Fuel Report
  generatedDate: Date,
  associatedEntityId: String, // Could be a trip ID, vehicle ID, etc.
  data: mongoose.Schema.Types.Mixed, // For flexible reporting data
});

module.exports = mongoose.model('Reporting', ReportingSchema);
