# Logging Middleware

Comprehensive logging middleware with JWT authentication, security monitoring, and performance tracking.

## Features

- Request/Response logging
- Error logging with stack traces
- Performance monitoring
- Security threat detection
- Rate limiting
- JWT token verification
- Database operation logging
- API call tracking

## Usage

```javascript
const { setupLogging, Log, authMiddleware } = require('./LoggingMiddleware');

const app = express();

setupLogging(app);

app.use('/api', authMiddleware, (req, res) => {
  Log("api", "info", "endpoint", "API call processed");
  res.json({ success: true });
});
```

## Middleware Functions

- `setupLogging(app)` - Setup all logging middleware
- `authMiddleware` - JWT token verification
- `Log(service, level, action, message)` - Custom logging
- `logApiCall(endpoint, method, statusCode, responseTime)` - API logging
- `logDatabaseOperation(operation, table, query, duration)` - DB logging
- `logSecurityEvent(event, details)` - Security event logging
- `logPerformanceMetric(metric, value)` - Performance metric logging

## Configuration

Edit `config.js` to customize:
- Log levels
- File paths
- Rate limits
- Security patterns
- Performance thresholds 