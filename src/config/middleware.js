const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const ResourceNotFound = require('../errors/ResourceNotFound');
const ValidationError = require('../errors/ValidationError');

class Middleware {
  static init(app) {
    app.use(bodyParser.urlencoded({
      extended: false,
    }));
    app.use(bodyParser.json());
    // parse Cookie header and populate req.cookies with an object keyed by the cookie names.
    app.use(cookieParser());
    // returns the compression middleware
    app.use(compression());
    // helps you secure your Express apps by setting various HTTP headers
    app.use(helmet());
    // providing a Connect/Express middleware that can be used to enable CORS with various options
    app.use(cors());
  }

  static errors(app) {
    // 404 Route response (must be very last as "route")
    app.use((_req, res) => {
      res.status(404).json({
        message: 'Route Not Found.',
      });
    });
    // 404 Resource response
    app.use((err, _req, res, next) => {
      if (err instanceof ResourceNotFound) {
        res.status(404).json({
          message: 'Resource Not Found.',
        });
      } else {
        next(err);
      }
    });
    // 422 Validation response
    app.use((err, _req, res, next) => {
      if (err instanceof ValidationError) {
        res.status(422).json({
          message: err.message,
        });
      } else {
        next(err);
      }
    });
    // 500 response
    app.use((err, _req, res, next) => {
      console.log('500 response');
      res.status(500).json({
        message: err.message,
        stack: err.stack,
      });
      // NOTE: next(err) doesn't cause "Cannot set headers after they are sent to the client"
      // because there's check in default error handler (?)
      next(err);
    });
    // another error handler
    app.use((err, _req, _res, next) => {
      console.log('another error handler');
      next(err);
    });
    // NOTE: default error handler goes "here".
  }
}

module.exports = Middleware;
