const express = require('express');
const UserController = require('../components/user/controller');

class Router {
  static init(app) {
    // user resource routes
    const userRouter = express.Router();
    // simple req.params.id changer {@see http://expressjs.com/en/5x/api.html#app.param}
    userRouter.param('id', (req, res, next, id) => {
      // NOTE: no need to check `isNaN(req.params.id)` bc only numeric accepted by route regexp.
      req.params.id = parseInt(id, 10);
      next();
    });
    userRouter.get('/', UserController.getAll);
    userRouter.get('/:id(\\d+)', UserController.getOne);
    userRouter.post('/', UserController.create);
    userRouter.put('/:id(\\d+)', UserController.put);
    userRouter.patch('/:id(\\d+)', UserController.patch);
    userRouter.delete('/:id(\\d+)', UserController.remove);

    // v1 routes
    const routerV1 = express.Router();
    routerV1.use('/user', userRouter);

    // global routes
    app.use('/v1', routerV1);
  }
}

module.exports = Router;
