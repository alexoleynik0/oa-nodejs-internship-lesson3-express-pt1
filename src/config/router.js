const express = require('express');

const UserController = require('../components/user/controller');
const UserSchemas = require('../components/user/schemas');
const paramToInt = require('../middleware/params/paramToInt');
const validation = require('../middleware/validation');

class Router {
  static init(app) {
    // user resource routes
    const userRouter = express.Router();
    // simple req.params.id changer {@see http://expressjs.com/en/5x/api.html#app.param}
    userRouter.param('id', paramToInt);
    userRouter.get('/', UserController.getAll);
    userRouter.get('/:id(\\d+)', UserController.getOne);
    userRouter.post('/', validation(UserSchemas.userCreateSchema), UserController.create);
    userRouter.put('/:id(\\d+)', validation(UserSchemas.userPutSchema), UserController.put);
    userRouter.patch('/:id(\\d+)', validation(UserSchemas.userPatchSchema), UserController.patch);
    userRouter.delete('/:id(\\d+)', UserController.remove);

    // v1 routes
    const routerV1 = express.Router();
    routerV1.use('/user', userRouter);

    // global routes
    app.use('/v1', routerV1);
  }
}

module.exports = Router;
