const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/audits - List all audits with optional filters
router.get('/audits', (req, res) => {
  const { status, risk, search } = req.query;
  let audits = db.getAllAudits();

  if (status && status !== 'All') {
    audits = audits.filter((a) => a.status.toLowerCase() === status.toLowerCase());
  }

  if (risk && risk !== 'All') {
    audits = audits.filter((a) => a.riskLevel.toLowerCase() === risk.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    audits = audits.filter(
      (a) =>
        (a.title && a.title.toLowerCase().includes(q)) ||
        (a.client && a.client.toLowerCase().includes(q)) ||
        (a.code && a.code.toLowerCase().includes(q)) ||
        (a.id && a.id.toLowerCase().includes(q))
    );
  }

  res.json({
    success: true,
    count: audits.length,
    data: audits
  });
});

// GET /api/audits/:id - Get specific audit by ID or code
router.get('/audits/:id', (req, res) => {
  const audit = db.getAuditById(req.params.id);
  if (!audit) {
    return res.status(404).json({ success: false, error: 'Audit engagement not found' });
  }
  res.json({ success: true, data: audit });
});

// POST /api/audits - Create new engagement
router.post('/audits', (req, res) => {
  const { title, client, engagementType, riskLevel, location, dueDate } = req.body;

  if (!title || !client) {
    return res.status(400).json({ success: false, error: 'Title and Client are required fields' });
  }

  const created = db.saveAudit({
    title,
    client,
    engagementType,
    riskLevel,
    location,
    dueDate
  });

  res.status(201).json({ success: true, data: created });
});

// PUT /api/audits/:id - Update engagement
router.put('/audits/:id', (req, res) => {
  const existing = db.getAuditById(req.params.id);
  if (!existing) {
    return res.status(404).json({ success: false, error: 'Audit engagement not found' });
  }

  const updated = db.saveAudit({
    ...existing,
    ...req.body,
    id: req.params.id
  });

  res.json({ success: true, data: updated });
});

// POST /api/audits/:id/controls/:controlId - Update control status and notes
router.post('/audits/:id/controls/:controlId', (req, res) => {
  const { status, notes } = req.body;
  const updated = db.updateControlStatus(req.params.id, req.params.controlId, status, notes);

  if (!updated) {
    return res.status(404).json({ success: false, error: 'Audit or Control not found' });
  }

  res.json({ success: true, data: updated });
});

// POST /api/audits/:id/sync - Synchronize client offline working paper
router.post('/audits/:id/sync', (req, res) => {
  const clientAudit = req.body;
  if (!clientAudit || clientAudit.id !== req.params.id) {
    return res.status(400).json({ success: false, error: 'Payload engagement ID does not match route parameter' });
  }

  const syncResult = db.syncEngagement(clientAudit);
  res.json(syncResult);
});

// POST /api/sync/batch - Batch sync multiple pending audits
router.post('/sync/batch', (req, res) => {
  const { audits } = req.body;
  if (!Array.isArray(audits)) {
    return res.status(400).json({ success: false, error: 'audits must be an array' });
  }

  const batchResult = db.batchSyncEngagements(audits);
  res.json(batchResult);
});

// GET /api/sync/history - Get synchronization audit trail
router.get('/sync/history', (req, res) => {
  const history = db.getSyncHistory();
  res.json({ success: true, data: history });
});

// POST /api/audits/reset - Reset to master template
router.post('/audits/reset', (req, res) => {
  const resetData = db.resetDatabase();
  res.json({ success: true, message: 'Database reset to template seed data', data: resetData });
});

module.exports = router;
