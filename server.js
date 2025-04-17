// Express server for NBA data visualizations
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());

// Serve static files (HTML, CSS, JS, data)
app.use(express.static(path.join(__dirname)));

// Debug route
app.get('/debug', (req, res) => {
  const fs = require('fs');
  try {
    const rootFiles = fs.readdirSync(__dirname);
    const dataFiles = fs.readdirSync(path.join(__dirname, 'data'));
    res.json({ status: 'Server is running', cwd: __dirname, files: { root: rootFiles, data: dataFiles } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});