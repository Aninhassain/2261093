const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, 'app.log');
const ERROR_LOG_FILE = path.join(__dirname, 'error.log');

const Log = (service, level, action, message) => {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] [${service}] [${level.toUpperCase()}] [${action}] ${message}\n`;
  
  console.log(logEntry.trim());
  fs.appendFileSync(LOG_FILE, logEntry);
  
  if (level === 'error') {
    fs.appendFileSync(ERROR_LOG_FILE, logEntry);
  }
};

const requestLogger = (req, res, next) => {
  const start = Date.now();
  const userAgent = req.get('User-Agent') || 'Unknown';
  const ip = req.ip || req.connection.remoteAddress;
  
  Log("http", "info", "request", `${req.method} ${req.path} from ${ip} - ${userAgent}`);
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    Log("http", "info", "response", `${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
  });
  
  next();
};

const errorLogger = (err, req, res, next) => {
  const errorMessage = `${err.message} - ${req.method} ${req.path} - Stack: ${err.stack}`;
  Log("error", "error", "middleware", errorMessage);
  next(err);
};

const performanceLogger = (req, res, next) => {
  const start = process.hrtime();
  
  res.on('finish', () => {
    const [seconds, nanoseconds] = process.hrtime(start);
    const duration = seconds * 1000 + nanoseconds / 1000000;
    
    if (duration > 1000) {
      Log("performance", "warn", "slow-request", `${req.method} ${req.path} took ${duration.toFixed(2)}ms`);
    }
  });
  
  next();
};

const securityLogger = (req, res, next) => {
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /union\s+select/i,
    /drop\s+table/i
  ];
  
  const requestBody = JSON.stringify(req.body);
  const requestUrl = req.url;
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(requestBody) || pattern.test(requestUrl)) {
      Log("security", "warn", "suspicious-activity", `Potential attack detected: ${req.method} ${req.path}`);
      break;
    }
  }
  
  next();
};

const rateLimitLogger = (req, res, next) => {
  const clientIP = req.ip || req.connection.remoteAddress;
  const currentTime = Date.now();
  
  if (!req.app.locals.rateLimit) {
    req.app.locals.rateLimit = {};
  }
  
  if (!req.app.locals.rateLimit[clientIP]) {
    req.app.locals.rateLimit[clientIP] = { count: 0, resetTime: currentTime + 60000 };
  }
  
  if (currentTime > req.app.locals.rateLimit[clientIP].resetTime) {
    req.app.locals.rateLimit[clientIP] = { count: 0, resetTime: currentTime + 60000 };
  }
  
  req.app.locals.rateLimit[clientIP].count++;
  
  if (req.app.locals.rateLimit[clientIP].count > 100) {
    Log("security", "warn", "rate-limit", `Rate limit exceeded for IP: ${clientIP}`);
    return res.status(429).json({ error: "Too many requests" });
  }
  
  next();
};

const databaseLogger = (operation, table, query, duration) => {
  Log("database", "info", operation, `${table} - ${query} - ${duration}ms`);
};

const apiLogger = (endpoint, method, statusCode, responseTime) => {
  Log("api", "info", endpoint, `${method} ${endpoint} ${statusCode} ${responseTime}ms`);
};

module.exports = {
  Log,
  requestLogger,
  errorLogger,
  performanceLogger,
  securityLogger,
  rateLimitLogger,
  databaseLogger,
  apiLogger
}; 