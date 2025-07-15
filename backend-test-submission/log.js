const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, 'app.log');

const Log = (service, level, action, message) => {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] [${service}] [${level.toUpperCase()}] [${action}] ${message}\n`;
  
  console.log(logEntry.trim());
  fs.appendFileSync(LOG_FILE, logEntry);
};

module.exports = Log; 