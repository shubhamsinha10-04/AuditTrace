const express = require('express');
const cors = require('cors');
const path = require('path');
const auditsRouter = require('./routes/audits');
const evidenceRouter = require('./routes/evidence');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for mobile app & web dev server
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsers with high threshold for base64 evidence images
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount API routes
app.use('/api', auditsRouter);
app.use('/api', evidenceRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  const audits = db.getAllAudits();
  res.json({
    status: 'ONLINE',
    service: 'AuditTrace Enterprise API Server',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    database: {
      totalEngagements: audits.length,
      syncedEngagements: audits.filter(a => a.isSynced).length,
      storageType: 'Atomic File-Backed Database (server/data/database.json)'
    },
    capabilities: [
      'Engagement Master Management',
      'Tamper-Evident SHA-256 Photo Evidence Hashing',
      'Offline-to-Cloud Bidirectional Sync',
      'Working Paper Cryptographic Seal Verification'
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`  🛡️  AUDITTRACE ENTERPRISE BACKEND SERVER`);
  console.log(`  🚀  Listening at: http://localhost:${PORT}`);
  console.log(`  📡  Health Check: http://localhost:${PORT}/api/health`);
  console.log(`  📋  Audits API:   http://localhost:${PORT}/api/audits`);
  console.log(`=======================================================`);
});

module.exports = app;
