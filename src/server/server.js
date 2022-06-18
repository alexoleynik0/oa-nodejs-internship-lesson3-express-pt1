const express = require('express');

const Middleware = require('../config/middleware');
const Router = require('../config/router');
const Connection = require('../config/connection');

class Server {
  static init(port = 3000) {
    const app = express();

    Middleware.init(app);

    Router.init(app);

    Middleware.errors(app);

    Connection.init(app, port);
  }
}

module.exports = Server;
