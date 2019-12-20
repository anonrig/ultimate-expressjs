const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const compression = require("compression");
const methodOverride = require("method-override");
const cors = require("cors");
const Boom = require("@hapi/boom");
const RateLimiter = require("express-rate-limit");
const isFunction = require("lodash.isfunction");

class Server {
  constructor({ port, logger, limiterOptions } = {}) {
    this.app = express();
    this.server = http.Server(this.app);
    this.port = port;
    this.logger = logger || console;
    this.limiterEnabled = !!limiterOptions;
    this.limiterOptions = limiterOptions;

    this.app.enable("trust proxy");
    this.app.use(cors());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(methodOverride("X-HTTP-Method"));
    this.app.use(methodOverride("X-HTTP-Method-Override"));
    this.app.use(methodOverride("X-Method-Override"));
    this.app.use(bodyParser.json());
    this.app.use(
      bodyParser.urlencoded({
        extended: true
      })
    );

    if (this.limiterEnabled) {
      this.limiter = new RateLimiter(this.limiterOptions);
      this.app.use(this.limiter);
    }
  }

  setRoutes(app) {
    /**
     * Just override this function to set your routes.
     */
  }

  setErrorHandlers() {
    /**
     * 404 pages.
     */
    this.app.use((req, res) => {
      const message = Boom.notFound("Not found");
      res.status(404).json(message.output.payload);
    });

    /* Handle errors */
    this.app.use((err, req, res, next) => {
      if (err) {
        if (isFunction(this.logger)) {
          this.logger(err);
        } else {
          this.logger.error(err);
        }
        const { statusCode, payload } = err.isBoom
          ? err.output
          : err.isJoi
          ? Boom.badRequest(err.details[0].message).output
          : Boom.boomify(err).output;

        return res
          .status(statusCode)
          .json(Object.assign({}, payload, { payload: err.data }));
      }

      const { statusCode, payload } = Boom.badImplementation(
        "Server error"
      ).output;
      res.status(statusCode).json(payload);
    });
  }

  listen() {
    this.setRoutes(this.app);
    this.setErrorHandlers(this.app);

    return new Promise((resolve, reject) => {
      this.server.listen(this.port, error => {
        if (error) return reject(error);

        resolve();
      });
    });
  }
}

module.exports = Server;
