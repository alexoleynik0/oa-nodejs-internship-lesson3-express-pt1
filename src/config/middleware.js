const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');

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
    // 404 response (must be very last)
    app.use((_req, res) => {
      res.status(404).json({
        message: 'Route Not Found.',
      });
    });
  }
}

module.exports = Middleware;
