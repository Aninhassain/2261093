const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const app = express();
const Log = require('./log.js');
const { generateCode } = require('./shortcodes');

app.use(cors());
app.use(express.json());

const PORT = 5000;
const DATA_FILE = path.join(__dirname, 'data.json');

// Load DB (or initialize)
let db = {};

// Try to load data if exists
if (fs.existsSync(DATA_FILE)) {
  db = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}

const saveDB = () => fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));

// POST /shorturls
app.post('/shorturls', (req, res) => {
  const { url, shortcode, validity } = req.body;

  if (!url) {
    Log("backend", "error", "api", "Missing URL field");
    return res.status(400).json({ error: "URL is required" });
  }

  let code = shortcode?.trim() || generateCode();
  const expiry = Date.now() + ((validity || 30) * 60 * 1000); // default: 30 min

  if (db[code]) {
    Log("backend", "warn", "api", `Shortcode "${code}" already exists`);
    return res.status(400).json({ error: "Shortcode already taken" });
  }

  db[code] = {
    originalURL: url,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(expiry).toISOString(),
    clicks: 0,
    clickHistory: []
  };

  saveDB();
  Log("backend", "info", "api", `Created short URL: ${code}`);

  res.json({
    shortcode: code,
    shortURL: `http://localhost:${PORT}/${code}`,
    expiresAt: db[code].expiresAt
  });
});

// GET /:shortcode → redirect + log
app.get('/:shortcode', (req, res) => {
  const { shortcode } = req.params;
  const entry = db[shortcode];

  if (!entry) {
    Log("backend", "error", "redirect", `Shortcode "${shortcode}" not found`);
    return res.status(404).send("Short URL not found.");
  }

  const now = new Date();
  if (new Date(entry.expiresAt) < now) {
    Log("backend", "info", "redirect", `Shortcode "${shortcode}" expired`);
    return res.status(404).send("This short link has expired.");
  }

  entry.clicks += 1;
  entry.clickHistory.push({ timestamp: now.toISOString(), location: "Unknown" });
  saveDB();

  Log("backend", "info", "redirect", `Redirected to ${entry.originalURL}`);
  res.redirect(entry.originalURL);
});

// GET /shorturls/:shortcode → stats
app.get('/shorturls/:shortcode', (req, res) => {
  const { shortcode } = req.params;
  const entry = db[shortcode];

  if (!entry) {
    Log("backend", "warn", "stats", `Stats requested for missing shortcode "${shortcode}"`);
    return res.status(404).json({ error: "Shortcode not found" });
  }

  res.json(entry);
});

// Start server
app.listen(PORT, () => {
  Log("backend", "info", "startup", `Server running on http://localhost:${PORT}`);
}); 