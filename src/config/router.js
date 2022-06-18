const UserController = require('../components/user/controller');

class Router {
  static init(app) {
    app.get('/users', UserController.findAll);
    app.post('/users', UserController.create);
  }
}

module.exports = Router;
