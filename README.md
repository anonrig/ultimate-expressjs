## Ultimate ExpressJS Wrapper

Tired of adding express, method-override, cors, compression, method-override etc. to all of your expressjs frameworks? Here is the solution:

```javascript
const http = require('ultimate-expressjs');
const express = new http({port: 3000});

express.setRoutes = (app) => {
  app.get('/', () => req.json({hello: 'world'}));
};

express.listen().then(() => console.info(`Server started`))

```

Pretty cool isn't it?


### Overriding setRoutes

In order to set your own routes, use the exaple code


```javascript
express.setRoutes = (app) => {
  // access your expressjs instance through app parameter.
}
```


### Overriding setErrorHandlers

In order to have your own commands for error handling (if you don't want to use default Boom):

```javascript
express.setErrorHandlers = (app) => {
  // access your expressjs instance through app parameter
}
```

### Coralogix integration

In order to use Coralogix as your default logger for logging errors, please use the following code:

```javascript
const expressLogger = (error) => {
  const log = new Coralogix.Log({
    severity:Coralogix.Severity.error,
    className: 'express.js',
    methodName: 'express',
    text: error
  })
  errorLogger.addLog(log)
}
const express = new http({port: PORT, logger: expressLogger})
```

UltimateExpress package automatically checks if `coralogix-logger` is installed in your project and if succeed, converts your logger into a callback function to send your unique log to Coralogix. If you want to remove this default behavior just set `http.isCoralogixInstalled = true`

### Rate Limit Support

Just add `limiterOptions` object to ultimate expressjs constructor. This object will be used inside `express-rate-limit`. For more information about the object context, please refer to `express-rate-limit` npm package documentation.

Example usage of Coralogix with Rate Limiter using Redis:

```javascript
const express = new http({
  port: process.env.PORT,
  logger: expressLogger,
  limiterOptions: {
    store: new RedisStore({
      client: require('redis').createClient(process.env.REDIS_URL)
    }),
    max: 10,
    delay: 0,
    windowMs: 1 * 60 * 1000
  },
  handler: (req, res, next) => {
    suspiciousLogger.addLog(new Coralogix.Log({
      severity: Coralogix.Severity.warning,
      className: 'index.js',
      methodName: 'rateLimiter',
      text: {
        message: `${req.headers['cf-connecting-ip']} is sending too many requests`,
        query: req.query
      }
    }))

    next(Boom.tooManyRequests('You have exceeded your rate limit.'))
  }
})
```