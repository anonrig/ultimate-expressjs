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
const expressLogger = (err) => {
  const log = new Coralogix.Log({
    severity:Coralogix.Severity.error,
    className: 'express.js',
    methodName: 'express',
    text: error
  })
  errorLogger.addLog()
}
const express = new http({port: PORT, logger: expressLogger})
```

UltimateExpress package automatically checks if `coralogix-logger` is installed in your project and if succeed, converts your logger into a callback function to send your unique log to Coralogix. If you want to remove this default behavior just set `http.isCoralogixInstalled = true`
