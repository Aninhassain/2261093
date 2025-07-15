const { Log, requestLogger, errorLogger, performanceLogger, securityLogger, rateLimitLogger, databaseLogger, apiLogger } = require('./middleware');
const { authMiddleware, verifyToken } = require('./log');
const config = require('./config');

const setupLogging = (app) => {
  app.use(requestLogger);
  app.use(performanceLogger);
  app.use(securityLogger);
  app.use(rateLimitLogger);
  app.use(errorLogger);
};

const logApiCall = (endpoint, method, statusCode, responseTime) => {
  apiLogger(endpoint, method, statusCode, responseTime);
};

const logDatabaseOperation = (operation, table, query, duration) => {
  databaseLogger(operation, table, query, duration);
};

const logSecurityEvent = (event, details) => {
  Log("security", "warn", event, details);
};

const logPerformanceMetric = (metric, value) => {
  Log("performance", "info", metric, `${metric}: ${value}`);
};

module.exports = {
  Log,
  setupLogging,
  authMiddleware,
  verifyToken,
  logApiCall,
  logDatabaseOperation,
  logSecurityEvent,
  logPerformanceMetric,
  config
}; 