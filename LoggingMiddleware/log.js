const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

const LOG_FILE = path.join(__dirname, 'app.log');
const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJtb2hhbW1hZGFuaW4zQGdtYWlsLmNvbSIsImV4cCI6MTc1MjU1NjE3MSwiaWF0IjoxNzUyNTU1MjcxLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiMGM3Zjg4ZDgtODk3NC00MzM4LWI0OTQtZGY3OTZmOTM1YzE1IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoiYW5pbiBoYXNzc2FpbiIsInN1YiI6ImE1YWEwY2FhLWNlZGEtNDRmNi05NTQwLTljYWU4YjNlOTNhZSJ9LCJlbWFpbCI6Im1vaGFtbWFkYW5pbjNAZ21haWwuY29tIiwibmFtZSI6ImFuaW4gaGFzc3NhaW4iLCJyb2xsTm8iOiIyMjYxMDkzIiwiYWNjZXNzQ29kZSI6IlFBaERVciIsImNsaWVudElEIjoiYTVhYTBjYWEtY2VkYS00NGY2LTk1NDAtOWNhZThiM2U5M2FlIiwiY2xpZW50U2VjcmV0IjoiVXRRV0Ria1VId0hucGt2USJ9.9wYTftMXeYR4F4U7zgG6RFM22N92cqnjg_otfJ2Irwk";

const Log = (service, level, action, message) => {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] [${service}] [${level.toUpperCase()}] [${action}] ${message}\n`;
  
  console.log(logEntry.trim());
  fs.appendFileSync(LOG_FILE, logEntry);
};

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN);
    return decoded;
  } catch (error) {
    return null;
  }
};

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    Log("auth", "error", "middleware", "No token provided");
    return res.status(401).json({ error: "Access token required" });
  }
  
  const decoded = verifyToken(token);
  if (!decoded) {
    Log("auth", "error", "middleware", "Invalid token");
    return res.status(401).json({ error: "Invalid token" });
  }
  
  req.user = decoded;
  Log("auth", "info", "middleware", `User authenticated: ${decoded.name}`);
  next();
};

const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    Log("http", "info", "request", `${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
  });
  
  next();
};

const errorLogger = (err, req, res, next) => {
  Log("error", "error", "middleware", `${err.message} - ${req.method} ${req.path}`);
  next(err);
};

module.exports = {
  Log,
  authMiddleware,
  requestLogger,
  errorLogger,
  verifyToken
}; 