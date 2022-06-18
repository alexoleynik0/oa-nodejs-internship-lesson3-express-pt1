const UserService = require('./service');

class UserController {
  /**
   * @function
   * @param {express.Request} req
   * @param {express.Response} res
   * @param {express.NextFunction} next
   * @returns {Promise < void >}
   */
  static async findAll(req, res, next) {
    try {
      const users = await UserService.findAll();

      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      // TODO: Joi validation
      const newUserData = req.body;
      const user = await UserService.create(newUserData);

      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
