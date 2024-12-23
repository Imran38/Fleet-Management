const express = require('express');
const router = express.Router();
const reportingService = require('../services/reportingService');

// Route to create a new report
router.post('/', async (req, res) => {
  try {
    const reportData = req.body;
    const createdReport = await reportingService.createReport(reportData);
    res.status(201).json(createdReport);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to get all reports
router.get('/', async (req, res) => {
  try {
    const reports = await reportingService.getAllReports();
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to get a specific report by ID
router.get('/:id', async (req, res) => {
  try {
    const reportId = req.params.id;
    const report = await reportingService.getReportById(reportId);
    res.status(200).json(report);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Route to update a report by ID
router.put('/:id', async (req, res) => {
  try {
    const reportId = req.params.id;
    const updateData = req.body;
    const updatedReport = await reportingService.updateReport(reportId, updateData);
    res.status(200).json(updatedReport);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Route to delete a report by ID
router.delete('/:id', async (req, res) => {
  try {
    const reportId = req.params.id;
    const deletedReport = await reportingService.deleteReport(reportId);
    res.status(200).json(deletedReport);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

module.exports = router;
