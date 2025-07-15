module.exports = {
  logLevel: process.env.LOG_LEVEL || 'info',
  logFile: 'app.log',
  errorLogFile: 'error.log',
  maxLogSize: 10 * 1024 * 1024,
  logRotation: {
    interval: '1d',
    maxFiles: 7
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000,
    maxRequests: 100
  },
  security: {
    enableSecurityLogging: true,
    suspiciousPatterns: [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /union\s+select/i,
      /drop\s+table/i,
      /exec\s*\(/i,
      /eval\s*\(/i
    ]
  },
  performance: {
    slowRequestThreshold: 1000,
    enablePerformanceLogging: true
  }
}; 