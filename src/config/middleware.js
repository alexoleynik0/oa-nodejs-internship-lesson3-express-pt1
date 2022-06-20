const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');

const routeNotFoundErrorResponse = require('../middleware/errors/routeNotFoundErrorResponse');
const resourceNotFoundErrorResponse = require('../middleware/errors/resourceNotFoundErrorResponse');
const validationErrorResponse = require('../middleware/errors/validationErrorResponse');
const dbErrorResponse = require('../middleware/errors/dbErrorResponse');
const unhandledErrorResponse = require('../middleware/errors/unhandledErrorResponse');

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
    app.use(routeNotFoundErrorResponse);
    // 404 Resource response
    app.use(resourceNotFoundErrorResponse);
    // 422 Validation response
    app.use(validationErrorResponse);
    // 500 DB errors response
    app.use(dbErrorResponse);
    // 500 unhandled response
    app.use(unhandledErrorResponse);
  }
}

module.exports = Middleware;
