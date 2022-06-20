const UserService = require('./service');
const ResourceNotFound = require('../../errors/ResourceNotFound');

const checkIfResourceFound = (resource) => {
  if (resource === null) {
    throw new ResourceNotFound();
  }
};

class UserController {
  static async getAll(req, res, next) {
    try {
      const users = await UserService.findAll();

      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }

  static async getOne(req, res, next) {
    try {
      const user = await UserService.findOneById(req.params.id);
      checkIfResourceFound(user);

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      // NOTE: validation happens in a middleware
      const userData = req.bodyValidated;
      const user = await UserService.createOne(userData);

      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }

  static async put(req, res, next) {
    try {
      const userData = req.bodyValidated;
      const putUser = await UserService.putOneById(req.params.id, userData);
      checkIfResourceFound(putUser);

      res.status(200).json(putUser);
    } catch (error) {
      next(error);
    }
  }

  static async patch(req, res, next) {
    try {
      const userData = req.bodyValidated;
      const patchedUser = await UserService.patchOneById(req.params.id, userData);
      checkIfResourceFound(patchedUser);

      res.status(200).json(patchedUser);
    } catch (error) {
      next(error);
    }
  }

  static async remove(req, res, next) {
    try {
      const removedUser = await UserService.removeOneById(req.params.id);
      checkIfResourceFound(removedUser);

      res.status(200).json(removedUser);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
