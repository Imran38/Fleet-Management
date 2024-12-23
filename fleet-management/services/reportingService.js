const Reporting = require('../models/reportingModel');

// Create a reporting record
async function createReport(reportData) {
  try {
    const report = new Reporting(reportData);
    const savedReport = await report.save();
    return savedReport;
  } catch (error) {
    throw new Error(`Error creating report: ${error.message}`);
  }
}

// Get all reports
async function getAllReports() {
  try {
    const reports = await Reporting.find();
    return reports;
  } catch (error) {
    throw new Error(`Error retrieving reports: ${error.message}`);
  }
}

// Get a specific report by ID
async function getReportById(reportId) {
  try {
    const report = await Reporting.findById(reportId);
    if (!report) {
      throw new Error(`Report with ID ${reportId} not found`);
    }
    return report;
  } catch (error) {
    throw new Error(`Error retrieving report: ${error.message}`);
  }
}

// Update a report by ID
async function updateReport(reportId, updateData) {
  try {
    const updatedReport = await Reporting.findByIdAndUpdate(reportId, updateData, {
      new: true,
      runValidators: true,
    });
    if (!updatedReport) {
      throw new Error(`Report with ID ${reportId} not found`);
    }
    return updatedReport;
  } catch (error) {
    throw new Error(`Error updating report: ${error.message}`);
  }
}

// Delete a report by ID
async function deleteReport(reportId) {
  try {
    const deletedReport = await Reporting.findByIdAndDelete(reportId);
    if (!deletedReport) {
      throw new Error(`Report with ID ${reportId} not found`);
    }
    return deletedReport;
  } catch (error) {
    throw new Error(`Error deleting report: ${error.message}`);
  }
}

module.exports = {
  createReport,
  getAllReports,
  getReportById,
  updateReport,
  deleteReport,
};
