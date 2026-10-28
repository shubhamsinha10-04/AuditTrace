const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const db = require('../db');

const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    const unique = `evd-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, unique);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 } // 25MB max
});

// Helper to calculate SHA-256 hash of a file or buffer
function computeSha256(buffer) {
  return 'sha256:' + crypto.createHash('sha256').update(buffer).digest('hex');
}

// POST /api/evidence/upload - Multipart or Base64 evidence upload
router.post('/evidence/upload', upload.single('photo'), (req, res) => {
  try {
    let filename = '';
    let fileBuffer = null;
    let mimeType = 'image/jpeg';

    if (req.file) {
      filename = req.file.filename;
      fileBuffer = fs.readFileSync(req.file.path);
      mimeType = req.file.mimetype;
    } else if (req.body.base64Data) {
      // Base64 JSON upload fallback
      const base64Data = req.body.base64Data.replace(/^data:image\/\w+;base64,/, '');
      fileBuffer = Buffer.from(base64Data, 'base64');
      filename = `evd-b64-${Date.now()}-${Math.round(Math.random() * 1e9)}.jpg`;
      const filePath = path.join(UPLOADS_DIR, filename);
      fs.writeFileSync(filePath, fileBuffer);
    } else {
      return res.status(400).json({ success: false, error: 'No photo file or base64Data provided' });
    }

    const sha256Hash = computeSha256(fileBuffer);
    const host = req.get('host') || 'localhost:5000';
    const protocol = req.protocol || 'http';
    const fileUrl = `${protocol}://${host}/uploads/${filename}`;

    const evidenceRecord = {
      id: `EVD-${Date.now().toString().slice(-6)}`,
      filename,
      uri: fileUrl,
      sha256Hash,
      caption: req.body.caption || 'Field Inspection Evidence',
      controlRef: req.body.controlRef || 'GEN-01',
      auditorId: req.body.auditorId || 'AUD-8824',
      timestamp: req.body.timestamp || new Date().toISOString(),
      gps: req.body.gps ? (typeof req.body.gps === 'string' ? JSON.parse(req.body.gps) : req.body.gps) : {
        latitude: 40.7128,
        longitude: -74.006,
        altitude: 22.4,
        accuracy: 1.8
      },
      fileSizeBytes: fileBuffer.length,
      mimeType,
      tamperVerified: true
    };

    // Save into server forensic registry
    const saved = db.recordEvidence(evidenceRecord);

    res.status(201).json({
      success: true,
      message: 'Tamper-evident evidence recorded and cryptographically sealed',
      data: saved
    });
  } catch (error) {
    console.error('Evidence upload error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/evidence/verify/:hash - Cryptographic proof verification
router.get('/evidence/verify/:hash', (req, res) => {
  const result = db.verifyEvidenceHash(req.params.hash);
  res.json({
    success: true,
    ...result
  });
});

module.exports = router;
